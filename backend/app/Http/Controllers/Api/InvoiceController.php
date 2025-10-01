<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class InvoiceController extends Controller
{
    // Obtener todas las facturas del usuario
    public function index(Request $request)
    {
        $invoices = Invoice::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['invoices' => $invoices], 200);
    }

    // Subir y procesar XML de factura
    public function store(Request $request)
    {
        $request->validate([
            'xml_file' => 'required|file|mimes:xml',
        ]);

        try {
            // Leer el archivo XML
            $xmlContent = file_get_contents($request->file('xml_file')->path());
            $xml = simplexml_load_string($xmlContent);

            // Registrar namespaces del CFDI
            $xml->registerXPathNamespace('cfdi', 'http://www.sat.gob.mx/cfd/4');
            $xml->registerXPathNamespace('tfd', 'http://www.sat.gob.mx/TimbreFiscalDigital');

            // Extraer datos del XML
            $uuid = $this->extractUuid($xml);
            $folio = $this->extractFolio($xml, $uuid);
            $emisor = $this->extractEmisor($xml);
            $receptor = $this->extractReceptor($xml);
            $moneda = (string) $xml['Moneda'];
            $total = (float) $xml['Total'];

            // Obtener tipo de cambio del DOF
            $tipoCambio = $this->getTipoCambio($moneda);

            // Verificar que no exista ya esta factura
            $existingInvoice = Invoice::where('uuid', $uuid)->first();
            if ($existingInvoice) {
                return response()->json([
                    'message' => 'Esta factura ya ha sido registrada anteriormente'
                ], 422);
            }

            // Crear la factura
            $invoice = Invoice::create([
                'uuid' => $uuid,
                'folio' => $folio,
                'emisor' => $emisor,
                'receptor' => $receptor,
                'moneda' => $moneda,
                'total' => $total,
                'tipo_cambio' => $tipoCambio,
                'user_id' => $request->user()->id,
            ]);

            return response()->json([
                'message' => 'Factura cargada exitosamente',
                'invoice' => $invoice
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al procesar el XML',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Extraer UUID del TimbreFiscalDigital
    private function extractUuid($xml)
    {
        $xml->registerXPathNamespace('tfd', 'http://www.sat.gob.mx/TimbreFiscalDigital');
        $complemento = $xml->xpath('//cfdi:Complemento/tfd:TimbreFiscalDigital');

        if (empty($complemento)) {
            throw new \Exception('No se encontró el TimbreFiscalDigital');
        }

        return (string) $complemento[0]['UUID'];
    }

    // Extraer folio, si no existe usar última sección del UUID
    private function extractFolio($xml, $uuid)
    {
        $folio = (string) $xml['Folio'];

        if (empty($folio)) {
            // Usar los últimos 8 caracteres del UUID como folio
            $folio = substr($uuid, -8);
        }

        return $folio;
    }

    // Extraer nombre o RFC del emisor
    private function extractEmisor($xml)
    {
        $emisor = $xml->xpath('//cfdi:Emisor');

        if (!empty($emisor)) {
            $nombre = (string) $emisor[0]['Nombre'];
            $rfc = (string) $emisor[0]['Rfc'];

            return !empty($nombre) ? $nombre : $rfc;
        }

        return 'Emisor Desconocido';
    }

    // Extraer nombre o RFC del receptor
    private function extractReceptor($xml)
    {
        $receptor = $xml->xpath('//cfdi:Receptor');

        if (!empty($receptor)) {
            $nombre = (string) $receptor[0]['Nombre'];
            $rfc = (string) $receptor[0]['Rfc'];

            return !empty($nombre) ? $nombre : $rfc;
        }

        return 'Receptor Desconocido';
    }

    // Obtener cambio del DOF
    private function getTipoCambio($moneda)
    {
        // Si es MXN, el tipo de cambio es 1
        if ($moneda === 'MXN') {
            return 1.00;
        }

        try {
            // Obtener fecha actual
            $fecha = now()->format('Y-m-d');

            // API del Diario Oficial de la Federación
            $url = "https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718/datos/{$fecha}/{$fecha}";

            // Token extraido de banxico
            $response = Http::withHeaders([
                'Bmx-Token' => '1d50ba6f3bdf34cd86bd686a3cb19c0e3c81b8df5341e94d2b765e10f196896a' // Nota: necesitas registrarte en Banxico para obtener token
            ])->get($url);

            if ($response->successful()) {
                $data = $response->json();

                if (isset($data['bmx']['series'][0]['datos'][0]['dato'])) {
                    return (float) $data['bmx']['series'][0]['datos'][0]['dato'];
                }
            }

            // Si falla, usar tipo de cambio por defecto
            return $this->getTipoCambioDefault($moneda);

        } catch (\Exception $e) {
            // En caso de error, usar valor por defecto
            return $this->getTipoCambioDefault($moneda);
        }
    }

    // Cambio fallback si falla la API
    private function getTipoCambioDefault($moneda)
    {
        $defaults = [
            'USD' => 17.00,
            'EUR' => 18.50,
            'CAD' => 12.50,
        ];

        return $defaults[$moneda] ?? 1.00;
    }

    // Eliminar factura
    public function destroy(Invoice $invoice, Request $request)
    {
        // Verificar que la factura pertenezca al usuario
        if ($invoice->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $invoice->delete();

        return response()->json(['message' => 'Factura eliminada exitosamente'], 200);
    }
}
