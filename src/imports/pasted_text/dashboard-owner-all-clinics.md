You are a senior product designer specializing in medical SaaS.
Continue the DentalOS design system established in the previous
mockup (onboarding + settings). Use the exact same visual style,
components, and layout system already defined.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTEXT — WHAT ALREADY EXISTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Design system already defined: teal primary, Inter/Plus
  Jakarta Sans, 8px grid, rounded corners, professional medical
  tone
- Sidebar navigation already designed (locked/unlocked states)
- Shell layout: 240px sidebar + topbar + main content area
- Responsive: Desktop 1440px + Tablet 768px per screen

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MULTI-CLINIC CONTEXT SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRITICAL — affects every screen:

Topbar always shows a clinic context selector:
  [DentalOS logo] [Clínica Del Valle Centro ▾] [🔔] [👤 Dr. García]

Behavior by role:
  OWNER/ADMIN:
    - Selector shows all org clinics + "Todas las clínicas" option
    - Default: "Todas las clínicas" (consolidated view)
    - Switching clinic filters entire system to that clinic
    - Consolidated view shows aggregated metrics only,
      NOT mixed patient records

  DENTIST:
    - If assigned to 1 clinic: no selector shown, fixed context
    - If assigned to 2+ clinics: selector shows only their
      assigned clinics, no "all clinics" option
    - Patient records are always scoped to the selected clinic
    - PRIVACY NOTE: dentist never sees patients from
      clinics they are not assigned to

  RECEPTIONIST/ASSISTANT:
    - No selector, fixed to their assigned clinic
    - Clinic name shown as static badge, not dropdown

Design the selector as a subtle dropdown in topbar,
showing clinic name + small location pin icon.
Active clinic highlighted with brand color dot indicator.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREENS TO DESIGN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

── DASHBOARD ─────────────────────────

SCREEN 1 — Dashboard (Owner, all clinics view)
URL: /dashboard
Layout: Widget grid system, 2-3 columns desktop, 1 column tablet

TOPBAR: Shows "Todas las clínicas" in clinic selector

WIDGET SYSTEM — important design note:
  Widgets are configurable by owner in Settings.
  Show a subtle "Personalizar dashboard" link top right
  that opens a panel to toggle widgets on/off.

DEFAULT ACTIVE WIDGETS (shown in this layout):

Widget 1 — Agenda del día (full width top)
  - Date header: "Lunes 24 de marzo · Todas las clínicas"
  - List of today's appointments sorted by time:
    · Time | Patient name | Dentist | Clinic badge |
      Visit type | Status badge
  - Status badges: Programada (gray) / Confirmada (blue) /
    En consulta (green) / Completada (teal) / Cancelada (red)
  - "Ver agenda completa →" link
  - Empty state: "No hay citas para hoy"

Widget 2 — Búsqueda rápida (left column, medium)
  - Large search input: "Buscar paciente por nombre,
    teléfono o código..."
  - Recent patients list below (last 5 accessed):
    · Avatar initials + Name + Last visit date + Clinic badge
  - Each row clickable → goes to patient record

Widget 3 — Resumen del día (right column, medium)
  ONLY shown if owner activated metrics widget
  - 4 stat cards:
    · Citas hoy (number)
    · Visitas completadas (number)
    · Pacientes nuevos (number + this week)
    · Clínicas activas (number)
  - Small sparkline charts per stat

Widget 4 — Alertas y pendientes (bottom, conditional)
  ONLY shown if owner activated alerts widget
  - List of: overdue follow-ups, pending payments,
    invitations not accepted
  - Each alert with priority indicator and action button

INACTIVE WIDGET PLACEHOLDER:
  Show 1 example of how a deactivated widget looks:
  Dashed border card with widget name + "Activar" button
  + brief description of what it shows

SCREEN 2 — Dashboard (Dentist, single clinic)
URL: /dashboard
TOPBAR: Shows assigned clinic name as static badge (no dropdown)

Same widget grid but:
  - Agenda del día: only shows THIS dentist's appointments
    (no dentist column, no clinic badge)
  - Búsqueda rápida: searches only patients in their clinic
  - No metrics widget (not available for dentist role)
  - Pending widget: only their own follow-ups

── PATIENTS ──────────────────────────

SCREEN 3 — Patients list
URL: /patients
Content:
  - Header: "Pacientes" + "Nuevo paciente" button (top right)
  - Search bar + filters row:
    · Search by name, phone, code
    · Filter: Status (activo/inactivo/archivado)
    · Filter: Clínica (if owner, shows clinic filter)
    · Sort: Nombre / Última visita / Fecha de registro
  - Patient table columns:
    · Código | Nombre completo | Edad | Teléfono |
      Última visita | Dentista asignado | Estado | Actions
  - Row actions: "Ver expediente" | "Nueva visita" | "..."
  - Pagination bottom
  - Empty state with "Registrar primer paciente" CTA

SCREEN 4 — New patient form
URL: /patients/new
Layout: Single column form, max 680px centered

Sections:
  DATOS PERSONALES (required):
    - Nombre(s), Apellido paterno, Apellido materno
    - Fecha de nacimiento (date picker) + Age (auto-calculated)
    - Sexo (select) + Identidad de género (optional text)
    - Teléfono + Email
    - Dirección (textarea, optional)

  CONTACTO DE EMERGENCIA (optional, collapsible):
    - Nombre contacto + Teléfono contacto

  ASIGNACIÓN (required):
    - Clínica (pre-selected from context, changeable if owner)
    - Dentista responsable (select from clinic's dentists)

  NOTE at bottom: "El expediente clínico se creará
  automáticamente al guardar el paciente"

  Buttons: [Cancelar] [Guardar paciente]

── CLINICAL RECORD ───────────────────

SCREEN 5 — Patient record (full)
URL: /patients/:id/record
Layout: Two-panel layout
  LEFT PANEL (320px): Patient summary sidebar
  RIGHT PANEL: Tabbed content area

LEFT PANEL — Patient card:
  - Large avatar with initials
  - Full name (large)
  - Patient code badge
  - Age + birth date
  - Phone + email (clickable)
  - Status badge
  - Assigned dentist
  - Clinic badge
  - "Editar paciente" link
  - Alert flags section: if alert_flags_json has entries,
    show red warning badges (allergies, medical alerts, etc.)
  - "Nueva visita" button (primary, prominent)

RIGHT PANEL TABS:
  Tab 1: "Resumen" (default)
  Tab 2: "Historia clínica"
  Tab 3: "Odontograma"
  Tab 4: "Visitas"
  Tab 5: "Documentos"

TAB 1 — Resumen:
  - Last visit summary card (date, reason, dentist, status)
  - Upcoming appointment if any
  - Medical alerts banner (if allergies/conditions exist)
    Red banner: "⚠ Alergias: Penicilina, Ibuprofeno"
  - Quick stats: Total visitas | Primera visita | Última visita

TAB 2 — Historia clínica:
  Two sub-sections side by side:

  Historia médica:
    - Blood type badge
    - Allergies (chip list)
    - Current medications
    - Systemic conditions
    - Pregnancy status (if applicable)
    - Contraindications
    - "Editar" button top right of section
    - Empty state: "Sin historia médica registrada
      — Completar ahora"

  Historia dental:
    - Previous treatments summary (text)
    - Dental habits
    - Prior complications
    - "Editar" button
    - Empty state similar

TAB 3 — Odontograma:
  PLACEHOLDER INTERACTIVE DESIGN:
  - Show a visual dental chart (adult 32-tooth diagram)
    displayed as an SVG-style illustration
  - Teeth arranged in standard odontogram layout
    (upper arch + lower arch, numbered 11-48 FDI notation)
  - Each tooth clickable (show hover state with tooth
    number tooltip)
  - Legend panel right side: tooth condition color codes
    (caries, tratado, extracción, corona, implante, etc.)
  - "Agregar nota" button per tooth on click
  - Overlay label: "Odontograma interactivo — Fase 2"
    shown as subtle watermark, NOT blocking the UI
  - The UI should look fully designed, just indicate
    it's in development with a small version badge

TAB 4 — Visitas:
  - Timeline list of all visits, newest first
  - Each visit row:
    · Date + time | Visit type | Dentist | Specialty badge |
      Status badge | "Ver detalle →" link
  - Status colors matching dashboard badges
  - "Nueva visita" button top right
  - Empty state: "Sin visitas registradas"

TAB 5 — Documentos:
  - Grid of attached files (clinical_attachments)
  - Each card: thumbnail/file icon + filename + date +
    file type badge + download/delete actions
  - "Subir documento" button
  - Empty state with upload zone

── VISITS ────────────────────────────

SCREEN 6 — New visit / Visit form
URL: /patients/:id/visits/new
Layout: Full page form, NOT a modal (complex content)

HEADER:
  - Patient name + code (breadcrumb: Pacientes > Nombre > Nueva visita)
  - Visit status badge (starts as "Borrador")
  - Save as draft button + "Completar visita" primary button

FORM SECTIONS IN ORDER:

SECTION 1 — Datos de la visita (always visible):
  - Fecha y hora (date-time picker, default now)
  - Tipo de visita (select: Consulta general / Urgencia /
    Control / Procedimiento / Evaluación)
  - Clínica (pre-selected)
  - Dentista (pre-selected from session user if dentist,
    dropdown if receptionist/owner)
  - Especialidad (select from clinic's active specialties)
    → CHANGING SPECIALTY reloads specialty-specific forms below

SECTION 2 — Core general (system template, always present,
  cannot be removed):
  Styled with subtle left border in brand color:
  - Motivo de consulta (textarea, required)
  - Hallazgos clínicos (textarea)
  - Diagnóstico (textarea)
  - Procedimientos realizados (textarea)
  - Indicaciones al paciente (textarea)
  NOTE: Show small "Sistema" badge on section header
  indicating this section is standard across all visits

SECTION 3 — Core de especialidad (loads based on specialty
  selected in Section 1):
  Styled with subtle left border in specialty accent color:
  Header: "[Specialty name]" + small "Especialidad" badge

  EXAMPLE — if Ortodoncia selected:
    - Clasificación de Angle (select: Clase I/II/III)
    - División (select: 1ra/2da, only if Clase II)
    - Tipo de aparatología (select: Fija/Removible/Mixta/Ninguna)
    - Arco activo (checkbox: Superior / Inferior)
    - Activación realizada (textarea)
    - Próxima cita recomendada en (number + unit select: días/semanas)

  EXAMPLE — if Endodoncia selected:
    - Pieza dental (tooth selector widget)
    - Número de conductos (number input)
    - Longitud de trabajo (number + mm)
    - Técnica de instrumentación (select)
    - Material de obturación (select)
    - Estado del tratamiento (select: En proceso/Completado)

  Show placeholder state: "Selecciona una especialidad
  para ver los campos específicos" when no specialty chosen

SECTION 4 — Campos adicionales (optional, dentist-added):
  Dashed border section, collapsible:
  Header: "Notas y campos adicionales" with collapse toggle
  - Rendered additional fields (if any previously added)
  - "+ Agregar campo" button → opens small inline panel:
    Field type selector: Texto libre / Número / Sí/No /
    Fecha / Lista de opciones
    Field label input
    [Agregar] button
  - NOTE: "Estos campos son personales y no afectan
    las métricas del sistema"

SECTION 5 — Archivos adjuntos:
  - Drag & drop zone for radiografías, fotos, etc.
  - Accepted types shown: JPG, PNG, PDF, DICOM
  - Already attached files list with remove option

BOTTOM ACTIONS BAR (sticky):
  [Cancelar] [Guardar borrador] [Completar visita →]

SCREEN 7 — Visit detail (read-only completed visit)
URL: /patients/:id/visits/:visitId
Same layout as new visit but all fields read-only.
  - "Editar visita" button if visit status allows editing
  - "Anular visita" option in "..." menu (with confirmation modal)
    NOT delete — status changes to 'voided'
  - Print/export button top right

── AGENDA ────────────────────────────

SCREEN 8 — Agenda (basic list view)
URL: /agenda
Layout: Full width, list-based

HEADER ROW:
  - Title: "Agenda"
  - Date navigation: [← Ayer] [Hoy — Lunes 24 Mar] [Mañana →]
  - Date picker icon to jump to any date
  - "Nueva cita" button

FILTERS ROW:
  - Dentista filter (if owner/admin: all dentists, if dentist: fixed)
  - Estado filter: Todas / Programadas / Confirmadas /
    En consulta / Completadas / Canceladas

APPOINTMENT LIST:
  Grouped by time slots:
  ┌─────────────────────────────────────────────────────┐
  │ 09:00  Juan Pérez García                            │
  │        Ortodoncia · Dr. García · Control            │
  │        [Confirmada] [Iniciar visita] [...]           │
  ├─────────────────────────────────────────────────────┤
  │ 09:30  María López Sánchez                          │
  │        Endodoncia · Dr. Martínez · Urgencia         │
  │        [Programada] [Confirmar] [Iniciar] [...]      │
  └─────────────────────────────────────────────────────┘

  Actions per appointment:
    - "Iniciar visita" → creates new visit linked to appointment
    - "Confirmar" → changes status to confirmed
    - "..." → Reagendar / Cancelar / Ver paciente

  Empty state: "Sin citas para este día
  ¿Deseas registrar una cita manualmente?"

NOTE — no calendar view in this phase, just list.
Add a subtle "Vista de calendario — Próximamente"
disabled toggle in the header.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROLE-BASED VIEW VARIATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Design these VARIATIONS (not full screens, use annotations):

OWNER consolidated dashboard:
  - Clinic selector shows "Todas las clínicas"
  - Agenda shows all clinics with clinic badge per row
  - Metrics show org-wide aggregates

DENTIST scoped view:
  - No clinic selector (fixed badge)
  - Agenda shows only their appointments
  - "Nueva visita" and patient search scoped to their clinic
  - No access to metrics or billing sections

RECEPTIONIST view:
  - Can see agenda for ALL dentists in their clinic
  - Can register new patients and create appointments
  - CANNOT open or create clinical visit forms
  - Patient record: can see demographics, NOT clinical tabs
    (Historia clínica, Visitas tabs show locked state with
    "Solo dentistas pueden acceder al expediente clínico")

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PATIENT DIGITIZATION FLOW
(existing paper records)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Design as an annotation/flow note (not a full screen):
Show that when creating a new patient, there's an option:
  "¿Es un paciente existente con expediente en papel?"
  Toggle → YES shows additional field:
  "Fecha de primera visita histórica" (date picker)
  + "Notas de importación" (textarea for the staff to
  note what physical records exist to be digitized)
This does not change the form layout, just adds these 2 fields.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DELIVERABLE STRUCTURE IN FIGMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Add these pages to the existing Figma file:

Page 5 — "🏠 Dashboard"
  Screen 1: Owner dashboard, all clinics (desktop + tablet)
  Screen 2: Dentist dashboard, single clinic (desktop)
  Widget configurator panel (desktop)
  Clinic selector dropdown states (open/closed)

Page 6 — "👥 Patients"
  Screen 3: Patient list (desktop + tablet)
  Screen 4: New patient form (desktop)
  Screen 5: Patient record — all 5 tabs (desktop)
  Tablet variation: patient record tabs as bottom nav

Page 7 — "📋 Visits"
  Screen 6: New visit form — general specialty (desktop)
  Screen 6b: New visit form — Ortodoncia specialty loaded
  Screen 6c: New visit form — Endodoncia specialty loaded
  Screen 7: Completed visit read-only (desktop)
  Tablet variation of visit form

Page 8 — "📅 Agenda"
  Screen 8: Agenda list view — full day (desktop + tablet)
  Appointment row states: all 5 status variations

Page 9 — "🔒 Role variations"
  Annotated screens showing permission differences:
  Owner vs Dentist vs Receptionist
  For: Dashboard, Patient record, Agenda

Page 10 — "🔄 Updated flows"
  Complete user flow diagram updated with new screens
  Including: login → onboarding → dashboard →
  patient → record → visit → back to agenda

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONSTRAINTS — DO NOT INCLUDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- No billing/payments screens in this phase
- No calendar view for agenda (list only this phase)
- No real-time features (no live updates, no chat)
- No patient portal (patients never log in to the system)
- No delete buttons anywhere — system uses
  status changes (voided, archived, inactive)
- Odontogram is placeholder only, mark as Phase 2
- Do not show internal UUIDs anywhere in the UI
- No push notifications design in this phase

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANNOTATIONS REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Add dev-notes for:
- Clinic selector: which API endpoint provides the
  clinic list per role (/clinics scoped by user_clinic_roles)
- Visit form specialty section: note that changing
  specialty triggers GET /forms/templates?specialty=:id
- Form layers: annotate which sections are system-locked
  vs specialty-specific vs user-custom
- Privacy note on patient list: "Query always includes
  clinic_id filter from active context — RLS enforced at DB"
- Odontogram: note FDI notation (11-48) for dev reference
- Appointment "Iniciar visita": note this creates a visit
  record with source_type = 'appointment' and links
  appointment_id