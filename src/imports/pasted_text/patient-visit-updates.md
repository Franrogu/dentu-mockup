━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DELTA 1 — PATIENT LIST (Screen 3)
Actualizar acciones por fila
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Replace row actions with:
  "Ver expediente" | "Ver visitas" | "Agendar cita" | "..."

"Ver visitas" → goes to /patients/:id/visits
  Shows full visit history for that patient
  (same as Tab 4 "Visitas" in the record, but accessible
  directly from the list without opening the full record)

"..." menu expands to show:
  · Editar paciente
  · Ver pagos  ← DISABLED with "Próximamente" tooltip
    (placeholder for billing phase, visible but not clickable,
    shows as grayed out with lock icon)
  · Archivar paciente (with confirmation modal)

This pattern communicates future billing feature
without cluttering current UI.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DELTA 2 — VISIT FORM specialty logic
Replace Section 3 of Screen 6
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SPECIALTY FIELD BEHAVIOR in Section 1:
  - On visit creation: auto-populates with the attending
    dentist's default_specialty_id
  - If dentist has multiple specialties in provider_specialties:
    shows as editable select pre-filled with default
  - If dentist has only 1 specialty: shows as read-only badge
  - Always changeable before visit is completed
  - Changing specialty reloads Section 3 content

DEV ANNOTATION: "GET /providers/:id/specialties to populate
selector. Auto-select provider_profiles.default_specialty_id"

SECTION 2 — Core general (UNCHANGED, always present):
  Same as before — system badge, cannot be removed

SECTION 3 — Specialty layer (UPDATED):
  Header: "Formulario de [Especialidad]"
  Shows TWO sub-states:

  SUB-STATE A — Single specialty selected:
    Shows the specialty-specific fields for that specialty
    Same as before (Ortodoncia fields, Endodoncia fields, etc.)

  SUB-STATE B — Dentista general, multiple specialties:
    Instead of ONE specialty section, show:

    Active specialty tabs:
    ┌──────────────────────────────────────────────────┐
    │ [General ✕] [+ Agregar especialidad]             │
    └──────────────────────────────────────────────────┘
    Content area shows fields for active tab

    "+ Agregar especialidad" opens inline dropdown:
    Shows only specialties from:
      1. clinic_specialties (enabled in this clinic)
      2. provider_specialties (this dentist handles)
    Already-added specialties are grayed out

    Each added specialty tab has ✕ to remove it
    (except the pre-selected default, which shows
    a lock icon and tooltip "Especialidad principal
    de esta visita — cámbiala en el campo superior")

  DESIGN NOTE: Tabs are compact (not full-width tabs),
  shown as pill-style tab group, max 3-4 visible before
  overflow "..." appears

  DEV ANNOTATION:
  "Specialty tabs map to clinical_form_templates filtered by:
   form_template_specialties.specialty_id IN [selected]
   AND applies_to_level = 'visit'
   AND status = 'active'
   Loads via GET /forms/templates?specialty=:id&level=visit"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DELTA 3 — PATIENT RECORD Tab 4 (Visitas)
Add specialty filter
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tab 4 "Visitas" in patient record — update to:

FILTER BAR above visit list:
  [Todas las especialidades ▾] [Todos los estados ▾]
  [Todas las fechas ▾]

Each visit row now shows:
  Date | Specialty badge (colored per specialty) |
  Visit type | Dentist | Status badge | "Ver detalle →"

SPECIALTY BADGE COLORS:
  Each specialty gets a distinct subtle color:
  General → gray
  Ortodoncia → purple
  Endodoncia → orange
  Periodoncia → green
  Cirugía → red
  (consistent across entire system wherever specialty appears)

When filter is active (e.g. "Ortodoncia"):
  List shows only ortho visits
  Filter badge shows: "Ortodoncia · X visitas"
  "Limpiar filtro" link appears

EMPTY STATE per filter:
  "Sin visitas de Ortodoncia registradas para este paciente"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DELTA 4 — NEW SCREEN: Visit history
(standalone, from patient list action)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 6b — Patient visit history
URL: /patients/:id/visits
(Same content as Tab 4 but as a full page, without
the patient record tabs above it)

Layout:
  Breadcrumb: Pacientes > [Nombre paciente] > Visitas

  LEFT MINI-CARD (240px): compact patient summary
    Name + code + age + assigned dentist
    "Ver expediente completo →" link

  RIGHT MAIN AREA: full visit list with filters
    Same filter bar as Tab 4
    Same visit rows
    "Nueva visita" button top right

This screen exists so receptionist/staff can check
visit history quickly without opening the full
clinical record.

PRIVACY NOTE (annotation):
  "Receptionist sees: date, type, dentist, status, specialty
   Receptionist does NOT see: clinical notes, diagnosis,
   procedures — those columns hidden by role"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADD TO PAGE 6 in Figma:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Screen 6b: Patient visit history standalone page
  Screen 3 updated: patient list with new row actions
  Visit form: specialty tab states
    · Single specialty state
    · Multi-specialty state (2 tabs active)
    · Add specialty dropdown open state

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SPECIALTY COLOR SYSTEM — add to Design System page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Add a "Specialty colors" section to Page 1:
  8 specialty color tokens (badge bg + text + border)
  Used consistently in: visit rows, form tabs,
  agenda list, patient record filters
  All colors must pass WCAG AA contrast on white bg