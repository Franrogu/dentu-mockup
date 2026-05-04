import { useParams, useSearchParams } from "react-router";
import { VisitFormView } from "../features/visits/components/VisitFormView";
import { getVisitById } from "../features/visits/visits.mock";

export function VisitForm() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const patientRouteId = searchParams.get("patientId") ?? "1";
  const visit = id ? getVisitById(id) : undefined;
  const mode = id ? "edit" : "new";

  return (
    <VisitFormView
      mode={mode}
      visit={visit}
      fromPatientContext={searchParams.has("patientId")}
      patientRouteId={patientRouteId}
    />
  );
}
