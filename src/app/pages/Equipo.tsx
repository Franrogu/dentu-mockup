import { Users, UserPlus, Mail, Phone } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const mockTeamMembers = [
  {
    id: 1,
    name: "Dra. María González",
    role: "Odontóloga General",
    email: "maria.gonzalez@ejemplo.com",
    phone: "+52 55 1234 5678",
    status: "Activo",
    clinic: "Clínica del Valle",
  },
  {
    id: 2,
    name: "Dr. Carlos Ramírez",
    role: "Ortodoncista",
    email: "carlos.ramirez@ejemplo.com",
    phone: "+52 55 8765 4321",
    status: "Activo",
    clinic: "Clínica del Valle",
  },
];

export function Equipo() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Equipo</h1>
          <p className="text-sm text-gray-600 mt-1">
            Visualiza y gestiona los miembros del equipo
          </p>
        </div>
        <Button className="bg-[#0F5F6D] hover:bg-[#0d4f5a]">
          <UserPlus className="w-4 h-4 mr-2" />
          Invitar miembro
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockTeamMembers.map((member) => (
          <Card key={member.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0F5F6D] text-white rounded-full flex items-center justify-center font-semibold">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                </div>
                <Badge variant="secondary">{member.status}</Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{member.phone}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Clínica:</span> {member.clinic}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Ver perfil
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Editar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gray-50 border-dashed">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-[#0F5F6D]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              Invita a más miembros del equipo
            </h3>
            <p className="text-sm text-gray-600">
              Colabora con tu equipo completo en DentalOS
            </p>
          </div>
          <Button className="bg-[#0F5F6D] hover:bg-[#0d4f5a]">
            <UserPlus className="w-4 h-4 mr-2" />
            Invitar
          </Button>
        </div>
      </Card>
    </div>
  );
}
