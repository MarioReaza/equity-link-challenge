import { useAuth } from '../contexts/AuthContext';

// Componente que muestra sus children solo si el usuario tiene el permiso
export default function CanAccess({ permission, children }) {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return null;
  }

  return children;
}
