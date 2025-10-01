import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import CanAccess from '../components/CanAccess';
import api from '../services/api';
import Swal from 'sweetalert2';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/invoices');
      setInvoices(response.data.invoices);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar las facturas',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    // Verificar que sea XML
    if (!file.name.endsWith('.xml')) {
      Swal.fire({
        icon: 'error',
        title: 'Archivo inválido',
        text: 'Por favor selecciona un archivo XML',
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('xml_file', file);

      const response = await api.post('/invoices', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Mostrar mensaje de éxito con SweetAlert
      await Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: response.data.message,
        confirmButtonText: 'Aceptar',
      });

      // Recargar la lista de facturas
      fetchInvoices();

      // Limpiar input
      event.target.value = '';

    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.error ||
                     'Error al cargar la factura';
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (invoice) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/invoices/${invoice.id}`);
        
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'Factura eliminada exitosamente',
          timer: 1500,
          showConfirmButton: false,
        });

        fetchInvoices();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la factura',
        });
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Cargando facturas...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Facturas</h2>
          
          {/* Botón de cargar factura - solo visible con permiso upload-invoices */}
          <CanAccess permission="upload-invoices">
            <label className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 cursor-pointer">
              {uploading ? 'Cargando...' : 'Cargar Factura XML'}
              <input
                type="file"
                accept=".xml"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </CanAccess>
        </div>

        {invoices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No hay facturas registradas
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    UUID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Folio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Emisor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receptor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Moneda
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo de Cambio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.uuid.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.folio}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.emisor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.receptor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.moneda}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${parseFloat(invoice.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {parseFloat(invoice.tipo_cambio).toFixed(4)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(invoice)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
