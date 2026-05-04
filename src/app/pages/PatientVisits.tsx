import { Navigate, useParams } from "react-router";

export function PatientVisits() {
  const { id } = useParams<{ id: string }>();

  return <Navigate to={`/pacientes/${id}?tab=historia-clinica`} replace />;
}
