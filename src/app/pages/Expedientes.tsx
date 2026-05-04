import { useState } from "react";
import { Search, FileText, Plus, Calendar, User, Download, Eye, Edit } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";

const mockRecords = [
  {
    id: 1,
    patientName: "Juan Pérez García",
    recordNumber: "EXP-2026-001",
    lastUpdate: "20 Mar 2026",
    createdDate: "15 Ene 2024",
    status: "Activo",
    visits: 12,
    treatments: ["Ortodoncia", "Limpieza dental"],
    lastTreatment: "Ajuste de brackets",
    doctor: "Dra. María González",
  },
  {
    id: 2,
    patientName: "Ana López Martínez",
    recordNumber: "EXP-2026-002",
    lastUpdate: "18 Mar 2026",
    createdDate: "10 Feb 2024",
    status: "Activo",
    visits: 8,
    treatments: ["Endodoncia", "Restauración"],
    lastTreatment: "Tratamiento de conducto",
    doctor: "Dr. Carlos Ramírez",
  },
  {
    id: 3,
    patientName: "Pedro Martínez Sánchez",
    recordNumber: "EXP-2026-003",
    lastUpdate: "15 Mar 2026",
    createdDate: "05 Mar 2024",
    status: "Activo",
    visits: 5,
    treatments: ["Limpieza dental", "Consulta general"],
    lastTreatment: "Profilaxis",
    doctor: "Dra. María González",
  },
  {
    id: 4,
    patientName: "María González Rodríguez",
    recordNumber: "EXP-2026-004",
    lastUpdate: "10 Mar 2026",
    createdDate: "20 Ene 2024",
    status: "Completado",
    visits: 15,
    treatments: ["Implantología", "Prótesis"],
    lastTreatment: "Colocación de corona",
    doctor: "Dr. Carlos Ramírez",
  },
];

export function Expedientes() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecords = mockRecords.filter(
    (record) =>
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.recordNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activo":
        return "bg-green-100 text-green-800 border-green-200";
      case "Completado":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Inactivo":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Expedientes</h1>
          <p className="text-sm text-gray-600 mt-1">
            Gestiona los expedientes clínicos de tus pacientes
          </p>
        </div>
        <Button className="bg-[#0F5F6D] hover:bg-[#0d4f5a]">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo expediente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0F5F6D]/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#0F5F6D]" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">248</p>
              <p className="text-sm text-gray-600">Total expedientes</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">195</p>
              <p className="text-sm text-gray-600">Activos</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">18</p>
              <p className="text-sm text-gray-600">Actualizados hoy</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">12</p>
              <p className="text-sm text-gray-600">Nuevos este mes</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre de paciente o número de expediente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="p-5 border border-gray-200 rounded-lg hover:border-[#0F5F6D] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-[#0F5F6D] text-white rounded-full flex items-center justify-center font-semibold shrink-0">
                      {getInitials(record.patientName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {record.patientName}
                        </h3>
                        <Badge className={getStatusColor(record.status)} variant="outline">
                          {record.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Expediente:</span>{" "}
                            {record.recordNumber}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Última actualización:</span>{" "}
                            {record.lastUpdate}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Creado:</span>{" "}
                            {record.createdDate}
                          </p>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Total visitas:</span>{" "}
                            {record.visits}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Último tratamiento:</span>{" "}
                            {record.lastTreatment}
                          </p>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <User className="w-3 h-3" />
                            <span>{record.doctor}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {record.treatments.map((treatment, index) => (
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
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredRecords.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  No se encontraron expedientes
                </h3>
                <p className="text-gray-600 mb-4">
                  No hay expedientes que coincidan con tu búsqueda
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
