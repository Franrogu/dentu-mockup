import { useParams } from "react-router";
import { VisitDetailPage } from "../features/booking/components/VisitDetailPage";

export function VisitDetail() {
  const { id } = useParams<{ id: string }>();

  return <VisitDetailPage visitId={id} />;
}
