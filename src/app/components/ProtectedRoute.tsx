import { ComponentType } from 'react';
import { Navigate } from 'react-router';
import { getDefaultRouteByRole, UserRole } from '../../services/auth';
import { useAuth } from '../auth/AuthContext';

type ProtectedRouteProps = {
  allowedRoles?: UserRole[];
  Component: ComponentType;
};

function ProtectedRoute({ allowedRoles, Component }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  // aguardar validacao da sessao com o backend
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-[#FFD700]">
        Carregando...
      </div>
    );
  }

  // redirecionar usuario sem login
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // bloquear usuario autenticado sem permissao para a rota
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDefaultRouteByRole(user.role)} replace />;
  }

  return <Component />;
}

export function createProtectedRoute(Component: ComponentType, allowedRoles?: UserRole[]) {
  return function ProtectedComponent() {
    return <ProtectedRoute Component={Component} allowedRoles={allowedRoles} />;
  };
}
