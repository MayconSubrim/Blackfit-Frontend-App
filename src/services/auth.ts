import { api, AUTH_TOKEN_KEY } from './api';

export const AUTH_USER_KEY = 'blackfit:auth-user';

export type UserRole = 'ALUNO' | 'INSTRUTOR' | 'RECEPCIONISTA';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  instructorId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type LoginCredentials = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: AuthUser;
};

export async function login(credentials: LoginCredentials) {
  // envia credenciais para a rota de login do backend
  const response = await api.post<LoginResponse>('/auth/login', credentials);

  // salva token e usuario para manter a sessao no frontend
  localStorage.setItem(AUTH_TOKEN_KEY, response.token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));

  return response;
}

export function logout() {
  // remove dados da sessao local
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getStoredUser() {
  // recupera usuario salvo no login
  const rawUser = localStorage.getItem(AUTH_USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    // limpa sessao caso o JSON salvo esteja invalido
    logout();
    return null;
  }
}

export function getDefaultRouteByRole(role: UserRole) {
  // instrutores entram direto no painel de instrutor
  if (role === 'INSTRUTOR') {
    return '/instructor';
  }

  // alunos e recepcionistas seguem para o dashboard por enquanto
  return '/dashboard';
}
