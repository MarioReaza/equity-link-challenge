import Layout from '../components/Layout';
import CanAccess from '../components/CanAccess';

export default function Invoices() {
  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Facturas</h2>
          
          {/* Botón de cargar factura - solo visible con permiso upload-invoices */}
          <CanAccess permission="upload-invoices">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              Cargar Factura
            </button>
          </CanAccess>
        </div>

        <div className="text-center py-12">
          <p className="text-gray-500">
            El módulo de facturas se implementará en la siguiente fase
          </p>
        </div>
      </div>
    </Layout>
  );
}
