import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

export default function Dashboard() {
  const { user, permissions } = useAuth();

  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Bienvenido, {user?.name}
        </h2>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tus permisos:
          </h3>
          <div className="flex flex-wrap gap-2">
            {permissions.length > 0 ? (
              permissions.map((permission) => (
                <span
                  key={permission}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {permission}
                </span>
              ))
            ) : (
              <span className="text-gray-500">Sin permisos asignados</span>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Rol:
          </h3>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            {user?.roles?.[0]?.name || 'Sin rol'}
          </span>
        </div>
      </div>
    </Layout>
  );
}
