/// <reference types="vite/client" />

const DEFAULT_API_URL = 'http://localhost:3000';
export const AUTH_TOKEN_KEY = 'blackfit:auth-token';

// URL base da API configurada no .env
export const API_URL =
  (import.meta.env.API_URL as string | undefined)?.replace(/\/$/, '') || DEFAULT_API_URL;

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

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

async function parseResponse(response: Response) {
  const contentType = response.headers.get('content-type');

  // resposta sem conteudo
  if (response.status === 204) {
    return null;
  }

  // tenta converter JSON quando a API sinaliza esse formato
  if (contentType?.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  // define cabecalho padrao para receber JSON
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  // define JSON automaticamente quando existe corpo na requisicao
  if (options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // envia token JWT nas rotas protegidas
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // executa requisicao para a API
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = await parseResponse(response);

  // padroniza erros para a aplicacao tratar na tela
  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(data, response.statusText || 'Erro na requisicao'),
      response.status,
      data
    );
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
