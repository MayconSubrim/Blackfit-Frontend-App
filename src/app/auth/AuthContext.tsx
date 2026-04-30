import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import {
  AuthUser,
  getCurrentUser,
  getStoredToken,
  LoginCredentials,
  LoginResponse,
  login,
  logout,
} from '../../services/auth';

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<LoginResponse>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const token = getStoredToken();

    if (!token) {
      setUser(null);
      return;
    }

    try {
      // busca dados reais do usuario logado no backend
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      // limpa sessao se token estiver invalido ou expirado
      logout();
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, []);

  const signIn = async (credentials: LoginCredentials) => {
    // autentica no backend e atualiza estado global
    const response = await login(credentials);
    setUser(response.user);
    return response;
  };

  const signOut = () => {
    // remove sessao local e usuario carregado
    logout();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      signIn,
      signOut,
      refreshUser,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
}
