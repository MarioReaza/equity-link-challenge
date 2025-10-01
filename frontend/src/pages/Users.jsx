import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import Swal from 'sweetalert2';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Obtener usuarios
      const usersResponse = await api.get('/users');
      setUsers(usersResponse.data.users);

      // Obtener permisos disponibles
      const permissionsResponse = await api.get('/permissions');
      setPermissions(permissionsResponse.data.permissions);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los datos',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignPermissions = async (user) => {
    // Obtener permisos actuales del usuario
    const currentPermissions = user.permissions.map(p => p.name);

    // Crear opciones para el select múltiple
    const inputOptions = {};
    permissions.forEach(permission => {
      inputOptions[permission.name] = permission.name;
    });

    const { value: selectedPermissions } = await Swal.fire({
      title: `Asignar permisos a ${user.name}`,
      input: 'select',
      inputOptions: inputOptions,
      inputPlaceholder: 'Selecciona permisos',
      showCancelButton: true,
      confirmButtonText: 'Asignar',
      cancelButtonText: 'Cancelar',
    });

    if (selectedPermissions) {
      try {
        await api.post(`/users/${user.id}/permissions`, {
          permissions: [selectedPermissions],
        });

        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Permisos asignados correctamente',
        });

        fetchData(); // Recargar datos
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron asignar los permisos',
        });
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Cargando...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Administración de Usuarios
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permisos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {user.roles?.[0]?.name || 'Sin rol'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.roles?.[0]?.permissions?.map((permission) => (
                        <span
                          key={permission.id}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                        >
                          {permission.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleAssignPermissions(user)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Asignar Permisos
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
