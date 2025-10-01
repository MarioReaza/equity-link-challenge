import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import CanAccess from './CanAccess';

export default function Layout({ children }) {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Función para verificar si la ruta está activa
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Equity Link
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Mostrar nombre del usuario */}
              <span className="text-gray-700">
                {user?.name}
              </span>
              
              {/* Botón de administración - solo visible con permiso manage-users */}
              <CanAccess permission="manage-users">
                <Link
                  to="/users"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Administración de Usuarios
                </Link>
              </CanAccess>

              {/* Botón de logout */}
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-5 px-2">
            {/* Dashboard Link */}
            <Link
              to="/dashboard"
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                isActive('/dashboard')
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              Dashboard
            </Link>

            {/* Facturas Link - solo visible con permiso view-invoices */}
            <CanAccess permission="view-invoices">
              <Link
                to="/invoices"
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md mt-1 ${
                  isActive('/invoices')
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Facturas
              </Link>
            </CanAccess>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
