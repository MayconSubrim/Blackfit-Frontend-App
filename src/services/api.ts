/// <reference types="vite/client" />

import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const DEFAULT_API_URL = 'http://localhost:3000';
export const AUTH_TOKEN_KEY = 'blackfit:auth-token';

// URL base da API configurada no .env
export const API_URL =
  (import.meta.env.API_URL as string | undefined)?.replace(/\/$/, '') || DEFAULT_API_URL;

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function getErrorMessage(data: unknown, fallback: string) {
  // backend retorna erros no formato { error: "mensagem" }
  if (data && typeof data === 'object' && 'error' in data) {
    const error = (data as { error?: unknown }).error;

    if (typeof error === 'string') {
      return error;
    }
  }

  return fallback;
}

function normalizeApiError(error: unknown): ApiError {
  // converte erro do Axios para erro padronizado da aplicacao
  if (error instanceof AxiosError) {
    const status = error.response?.status || 0;
    const data = error.response?.data;
    const message = getErrorMessage(data, error.message || 'Erro na requisicao');

    return new ApiError(message, status, data);
  }

  return new ApiError('Erro inesperado na requisicao', 0, null);
}

export const http = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
  },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  // envia token JWT nas rotas protegidas
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

async function request<T>(callback: () => Promise<{ data: T }>) {
  try {
    const response = await callback();
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export const api = {
  get: <T>(path: string, config?: AxiosRequestConfig) =>
    request<T>(() => http.get<T>(path, config)),
  post: <T>(path: string, body?: unknown, config?: AxiosRequestConfig) =>
    request<T>(() => http.post<T>(path, body, config)),
  put: <T>(path: string, body?: unknown, config?: AxiosRequestConfig) =>
    request<T>(() => http.put<T>(path, body, config)),
  patch: <T>(path: string, body?: unknown, config?: AxiosRequestConfig) =>
    request<T>(() => http.patch<T>(path, body, config)),
  delete: <T>(path: string, config?: AxiosRequestConfig) =>
    request<T>(() => http.delete<T>(path, config)),
};

export type UserItem = {
  id: string;
  name: string;
  email: string;
  role: 'ALUNO' | 'INSTRUTOR' | 'RECEPCIONISTA';
  instructorId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type CreateInstructorPayload = {
  name: string;
  email: string;
  password: string;
};

type CreateStudentPayload = CreateInstructorPayload & {
  instructorId: string;
};

type UpdateUserPayload = {
  name: string;
  email: string;
  password?: string;
  instructorId?: string;
};

export function getUsers() {
  // listar usuarios para a recepcao
  return api.get<UserItem[]>('/users');
}

export function createInstructor(payload: CreateInstructorPayload) {
  // criar instrutor pelo fluxo da recepcao
  return api.post<UserItem>('/users/create-instructor', payload);
}

export function createStudent(payload: CreateStudentPayload) {
  // criar aluno vinculado a um instrutor
  return api.post<UserItem>('/users/create-student', payload);
}

export function updateUserById(id: string, payload: UpdateUserPayload) {
  // editar dados basicos de um usuario
  return api.patch<UserItem>(`/users/${id}`, payload);
}

export function assignStudentToInstructor(studentId: string, instructorId: string) {
  // atualizar instrutor responsavel pelo aluno
  return api.patch<UserItem>(`/users/${studentId}/instructor`, { instructorId });
}
