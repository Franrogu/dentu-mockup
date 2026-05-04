import { useState } from "react";
import { Search, FileText, Plus, Calendar, DollarSign, Download, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";

const mockInvoices = [
  {
    id: 1,
    invoiceNumber: "FACT-2026-001",
    patientName: "Juan Pérez García",
    date: "20 Mar 2026",
    amount: 3500.00,
    status: "Pagada",
    paymentMethod: "Tarjeta de crédito",
    treatments: ["Ortodoncia - Ajuste de brackets"],
  },
  {
    id: 2,
    invoiceNumber: "FACT-2026-002",
    patientName: "Ana López Martínez",
    date: "18 Mar 2026",
    amount: 2800.00,
    status: "Pendiente",
    paymentMethod: "Efectivo",
    treatments: ["Endodoncia - Tratamiento de conducto"],
  },
  {
    id: 3,
    invoiceNumber: "FACT-2026-003",
    patientName: "Pedro Martínez Sánchez",
    date: "15 Mar 2026",
    amount: 1200.00,
    status: "Pagada",
    paymentMethod: "Transferencia bancaria",
    treatments: ["Limpieza dental - Profilaxis"],
  },
  {
    id: 4,
    invoiceNumber: "FACT-2026-004",
    patientName: "María González Rodríguez",
    date: "10 Mar 2026",
    amount: 4500.00,
    status: "Vencida",
    paymentMethod: "Efectivo",
    treatments: ["Implantología - Colocación de corona"],
  },
];

export function Facturacion() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInvoices = mockInvoices.filter(
    (invoice) =>
      invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pagada":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Vencida":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pagada":
        return <CheckCircle className="w-4 h-4" />;
      case "Pendiente":
        return <Clock className="w-4 h-4" />;
      case "Vencida":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const totalPagadas = mockInvoices
    .filter((inv) => inv.status === "Pagada")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalPendientes = mockInvoices
    .filter((inv) => inv.status === "Pendiente")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalVencidas = mockInvoices
    .filter((inv) => inv.status === "Vencida")
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Facturación</h1>
          <p className="text-sm text-gray-600 mt-1">
            Gestiona las facturas y pagos de tus pacientes
          </p>
        </div>
        <Button className="bg-[#0F5F6D] hover:bg-[#0d4f5a]">
          <Plus className="w-4 h-4 mr-2" />
          Nueva factura
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0F5F6D]/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#0F5F6D]" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(totalPagadas + totalPendientes + totalVencidas)}
              </p>
              <p className="text-sm text-gray-600">Total facturado</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(totalPagadas)}
              </p>
              <p className="text-sm text-gray-600">Pagadas</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(totalPendientes)}
              </p>
              <p className="text-sm text-gray-600">Pendientes</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(totalVencidas)}
              </p>
              <p className="text-sm text-gray-600">Vencidas</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre de paciente o número de factura..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-3">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="p-5 border border-gray-200 rounded-lg hover:border-[#0F5F6D] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {invoice.invoiceNumber}
                          </h3>
                          <Badge className={getStatusColor(invoice.status)} variant="outline">
                            <span className="flex items-center gap-1">
                              {getStatusIcon(invoice.status)}
                              {invoice.status}
                            </span>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{invoice.patientName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-semibold text-[#0F5F6D]">
                          {formatCurrency(invoice.amount)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Fecha: {invoice.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>Método: {invoice.paymentMethod}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FileText className="w-4 h-4" />
                        <span>{invoice.treatments.length} tratamiento(s)</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Tratamientos:</span>
                      </p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {invoice.treatments.map((treatment, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {treatment}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </Button>
                    {invoice.status === "Pendiente" && (
                      <Button size="sm" className="w-full bg-[#0F5F6D] hover:bg-[#0d4f5a]">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Marcar pagada
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredInvoices.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  No se encontraron facturas
                </h3>
                <p className="text-gray-600 mb-4">
                  No hay facturas que coincidan con tu búsqueda
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm("")}
                >
                  Limpiar búsqueda
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
