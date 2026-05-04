import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { ChevronRight, MoreHorizontal, Printer, Pencil } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { MiniOdontogramPreview, PaymentStatusBadge, VisitStatusBadge } from "./VisitPrimitives";
import { formatVisitDate, formatVisitTimeRange } from "../visit-utils";
import type { VisitMock } from "../visits.mock";

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card className="rounded-2xl border-gray-200 p-5">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-gray-700">{children}</div>
    </Card>
  );
}

export function VisitDetailView({ visit }: { visit: VisitMock }) {
  const navigate = useNavigate();

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <button onClick={() => navigate("/visitas")} className="transition-colors hover:text-[#0F5F6D]">
          Visitas
        </button>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-gray-700">{visit.patient.fullName}</span>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-gray-900">Detalle de visita</span>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold text-gray-900">Visita del {formatVisitDate(visit.startedAt)}</h1>
              <VisitStatusBadge status={visit.status} />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline" className="rounded-full border-gray-200 bg-gray-50 text-gray-600">
                {formatVisitTimeRange(visit.startedAt, visit.endedAt)}
              </Badge>
              <Badge variant="outline" className="rounded-full border-gray-200 bg-gray-50 text-gray-600">
                {visit.clinic.name}
              </Badge>
              <Badge variant="outline" className="rounded-full border-gray-200 bg-gray-50 text-gray-600">
                {visit.attendingDentist.name}
              </Badge>
              <Badge variant="outline" className="rounded-full border-gray-200 bg-gray-50 text-gray-600">
                {visit.specialty.name}
              </Badge>
              <Badge variant="outline" className="rounded-full border-gray-200 bg-gray-50 text-gray-600">
                Tipo: {visit.visitType.label}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => navigate(`/visitas/${visit.id}/editar`)}>
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
            <Button variant="outline" className="rounded-xl">
              <Printer className="h-4 w-4" />
              Imprimir resumen
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <DetailSection title="Motivo de consulta">
            <p className="font-medium text-gray-900">{visit.reasonForVisit}</p>
            <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Queja principal</p>
              <p className="mt-2 text-sm leading-6 text-gray-700">{visit.chiefComplaint || "—"}</p>
            </div>
          </DetailSection>

          <DetailSection title="Notas clínicas">{visit.clinicalNotes || "Sin notas clínicas registradas."}</DetailSection>
          <DetailSection title="Diagnóstico">{visit.diagnosisNotes || "Sin diagnóstico registrado."}</DetailSection>
          <DetailSection title="Procedimientos realizados">
            {visit.proceduresSummary || "Sin procedimientos documentados."}
          </DetailSection>

          <DetailSection title="Condiciones registradas durante esta visita">
            {visit.related.conditions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {visit.related.conditions.map((condition) => (
                  <Badge key={condition} variant="outline" className="rounded-full border-teal-200 bg-teal-50 text-[#0F5F6D]">
                    {condition}
                  </Badge>
                ))}
              </div>
            ) : (
              <p>Sin condiciones adicionales registradas.</p>
            )}
          </DetailSection>

          <DetailSection title="Odontograma">
            <MiniOdontogramPreview
              highlightedTeeth={visit.related.odontogramTeeth}
              label={visit.related.odontogramLabel || "Sin snapshot vinculado"}
            />
          </DetailSection>

          <DetailSection title="Adjuntos">
            {visit.related.attachments.length > 0 ? (
              <div className="space-y-3">
                {visit.related.attachments.map((attachment) => (
                  <div key={attachment.name} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <p className="font-medium text-gray-900">
                      {attachment.name} · {attachment.extension} · {attachment.size}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>Sin adjuntos vinculados.</p>
            )}
          </DetailSection>

          <DetailSection title="Pago asociado">
            <div className="flex flex-wrap items-center gap-2">
              {visit.related.paymentStatus ? <PaymentStatusBadge status={visit.related.paymentStatus} /> : null}
              <span className="font-medium text-gray-900">{visit.related.paymentAmount || "Sin pago registrado"}</span>
            </div>
            {visit.related.paymentLabel ? <p className="mt-2 text-sm text-gray-500">{visit.related.paymentLabel}</p> : null}
          </DetailSection>
        </div>

        <div className="xl:sticky xl:top-8 xl:self-start">
          <Card className="rounded-2xl border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-900">Línea de tiempo de la visita</h2>

            <div className="mt-5 space-y-4">
              {visit.timeline.map((item, index) => (
                <div key={`${item.time}-${item.label}`} className="relative pl-8">
                  {index < visit.timeline.length - 1 ? (
                    <div className="absolute left-[7px] top-6 h-[calc(100%+12px)] w-px bg-gray-200" />
                  ) : null}
                  <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full border border-teal-200 bg-teal-50" />
                  <p className="text-sm font-medium text-gray-900">{item.time} {item.label}</p>
                  <p className="mt-1 text-sm text-gray-500">{item.by}</p>
                </div>
              ))}
            </div>

            <Button variant="outline" className="mt-6 w-full rounded-xl">
              Ver auditoría completa
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
