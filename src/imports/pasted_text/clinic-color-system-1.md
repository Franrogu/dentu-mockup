## Delta del prompt — vistas multi-clínica
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLINIC COLOR SYSTEM
(Add to Design System page 1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Each clinic has an assigned color (owner sets in settings).
This color appears as an accent throughout the system
ONLY when viewing consolidated/multi-clinic context.
When viewing a single clinic, the color is not used —
the system uses the brand teal normally.

Default clinic color palette (auto-assigned on creation,
owner can change):
  Clínica 1 → Teal    #0F5F6D  (brand default)
  Clínica 2 → Violet  #6B46C1
  Clínica 3 → Amber   #B45309
  Clínica 4 → Rose    #BE185D
  Clínica 5 → Cyan    #0E7490
  Clínica 6 → Emerald #065F46

Clinic color appears in:
  - Clinic badge background (subtle, 15% opacity bg + full color text/border)
  - Left border accent on agenda rows
  - Filter pill when that clinic is selected
  - Legend dot in metrics/charts
  - Color picker in Settings → Clínicas → Datos generales

NEVER use full saturated color as background —
always subtle tinted badge. Medical UI must stay clean.

Show in design system:
  - Clinic badge component in all 6 color variants
  - Badge sizes: sm (agenda rows) / md (cards) / lg (headers)
  - Color picker component for settings

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DELTA 1 — TOPBAR clinic selector
Update for multi-clinic with colors
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Clinic selector dropdown (owner, 3 clinics example):

┌─────────────────────────────────────────────┐
│ 🏥 Todas las clínicas          ▾            │
└─────────────────────────────────────────────┘

Dropdown open state:
┌─────────────────────────────────────────────┐
│ ● Todas las clínicas           (checkmark)  │
│ ──────────────────────────────────────────  │
│ ■ Clínica Del Valle Centro                  │
│   Teal badge · 4 dentistas                  │
│                                             │
│ ■ Clínica Del Valle Norte                   │
│   Violet badge · 2 dentistas                │
│                                             │
│ ■ Clínica Del Valle Sur                     │
│   Amber badge · 3 dentistas                 │
│ ──────────────────────────────────────────  │
│ ⚙ Administrar clínicas →                   │
└─────────────────────────────────────────────┘

Each clinic row shows:
  - Color square (■) matching clinic color
  - Clinic name
  - Subtle secondary line: color badge label + dentist count

Active selection reflected in topbar:
  "Todas las clínicas" → neutral globe icon
  Single clinic selected → colored square ■ + clinic name
    in the clinic's color accent

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DELTA 2 — DASHBOARD owner, all clinics
Replace Screen 1 completely
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 1A — Dashboard owner "Todas las clínicas"

METRICS WIDGET (expandable):
Default collapsed state — shows org totals:
┌─────────────────────────────────────────────────────┐
│ Resumen de hoy                          [Expandir ▾]│
│                                                     │
│  12 citas hoy    8 completadas    3 nuevos pacientes│
│  ─────────────   ─────────────   ──────────────     │
│  ● todas las clínicas                               │
└─────────────────────────────────────────────────────┘

Expanded state — shows breakdown per clinic:
┌─────────────────────────────────────────────────────┐
│ Resumen de hoy                          [Colapsar ▲]│
│                                                     │
│  TOTAL ORG                                          │
│  12 citas · 8 completadas · 3 nuevos pacientes      │
│                                                     │
│  ■ Clínica Del Valle Centro  (teal)                 │
│  5 citas · 4 completadas · 1 nuevo                  │
│  ████████░░  80% completadas                        │
│                                                     │
│  ■ Clínica Del Valle Norte   (violet)               │
│  4 citas · 3 completadas · 1 nuevo                  │
│  ██████░░░░  75% completadas                        │
│                                                     │
│  ■ Clínica Del Valle Sur     (amber)                │
│  3 citas · 1 completada · 1 nuevo                   │
│  ███░░░░░░░  33% completadas                        │
└─────────────────────────────────────────────────────┘

AGENDA WIDGET (all clinics consolidated):
Header: "Agenda de hoy — todas las clínicas"
Filter pills: [Todas ●] [■ Centro] [■ Norte] [■ Sur]
  Pills use clinic colors, clicking filters the list

Appointment rows — left border accent = clinic color:
┌─────────────────────────────────────────────────────┐
│▌ 09:00  Juan Pérez          ■ Centro                │
│  Dr. García · Ortodoncia · Confirmada               │
├─────────────────────────────────────────────────────┤
│▌ 09:00  Ana Martínez        ■ Norte                 │
│  Dra. López · General · Programada                  │
├─────────────────────────────────────────────────────┤
│▌ 09:30  Carlos Ruiz         ■ Sur                   │
│  Dr. Mendez · Endodoncia · En consulta              │
└─────────────────────────────────────────────────────┘

Left colored border (▌) uses clinic's accent color.
Clinic badge is small, subtle — patient name is primary.

SCREEN 1B — Dashboard owner, single clinic selected
(when owner picks "Clínica Del Valle Norte" from selector)
  - Topbar shows: ■ Clínica Del Valle Norte (violet accent)
  - Agenda header: "Agenda de hoy — Clínica Del Valle Norte"
  - Filter pills disappear (no need to filter, single clinic)
  - Clinic badges disappear from rows (implied context)
  - Metrics show only that clinic's numbers
  - System behaves exactly like a dentist's single-clinic view
    but with owner permissions intact

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DELTA 3 — PATIENT RECORD multi-clinic
Update Screen 5 Tab 4 (Visitas)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Patient record is a single unified record (one per patient
per org). Visits from all clinics appear in Tab 4.

TAB 4 "Visitas" — updated filter bar:

[Todas las clínicas ▾] [Todas las especialidades ▾]
[Todos los estados ▾]  [Fecha ▾]          [Limpiar]

"Todas las clínicas" filter shows:
  ● Todas
  ■ Clínica Del Valle Centro  (teal)
  ■ Clínica Del Valle Norte   (violet)

Each visit row:
  Left border accent = clinic color (same as agenda)
  Date | ■ Clinic badge | Specialty badge |
  Dentist | Status | "Ver detalle →"

ACTIVE FILTER STATE:
  When "Clínica Del Valle Norte" selected:
  Filter bar shows: "■ Norte · X visitas" pill with ✕
  List filters to only that clinic's visits
  Empty state: "Este paciente no tiene visitas en
  Clínica Del Valle Norte"

OWNER SEES ALL VISITS — no restriction.
DENTIST SEES: only visits from their assigned clinics.
  If patient visited Norte and Sur, dentist from Norte
  only sees Norte visits — Sur visits hidden.
  Tab shows subtle note: "Mostrando visitas de
  Clínica Del Valle Norte · Tienes acceso a 1 clínica"

DEV ANNOTATION:
  "Query: SELECT visits WHERE patient_id = :id
   AND clinic_id IN (user's accessible clinic_ids)
   Enforced by user_clinic_roles + RLS"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DELTA 4 — PATIENT LIST multi-clinic
Update Screen 3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Patient belongs to org, not to a single clinic.
A patient can have visits in multiple clinics.

OWNER VIEW — "Todas las clínicas":
  Filter row adds: [Clínica ▾] filter
  Table adds column: "Clínicas" showing colored dots
  for each clinic where patient has visited
  Example: ■● (teal dot + violet dot = visited 2 clinics)
  Hovering dots shows clinic names tooltip

OWNER VIEW — single clinic selected:
  [Clínica ▾] filter hidden (already filtered by context)
  Table shows only patients who have visited that clinic
  Clinic column hidden

DENTIST VIEW:
  Sees only patients who have visited their clinic(s)
  No clinic column (implied context)
  No clinic filter

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DELTA 5 — SETTINGS: Clinic color picker
Update Screen 8 (Settings Clínicas) and Screen 9
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Settings → Clínicas list (Screen 8):
  Each clinic card now shows its color as a
  colored left border accent (same style as agenda rows)

Settings → Clínica detalle (Screen 9), Datos generales:
  Add "Color de identificación" field:
  - Label: "Color de identificación"
  - Helper: "Este color identifica la clínica en
    vistas consolidadas de la organización"
  - Component: Row of 8 preset color circles to pick from
    + "Personalizado" option that opens a hex input
  - Current color shown with checkmark
  - Preview: small agenda row mock showing how it looks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEW SCREEN — Owner clinic switcher
(first login after onboarding, multi-clinic)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 9 (new) — Post-login clinic context
URL: /dashboard (auto-loads, no separate route)

ONLY SHOWN when:
  Owner has 2+ clinics AND
  No clinic context stored in session

Full-page overlay ON TOP of dashboard
(dashboard visible but blurred behind):

┌─────────────────────────────────────────────────────┐
│                                                     │
│   Buenos días, Dr. García                           │
│   ¿En qué clínica trabajas hoy?                     │
│                                                     │
│  ┌─────────────────┐  ┌─────────────────┐           │
│  │ ■               │  │ ■               │           │
│  │ Del Valle       │  │ Del Valle Norte │           │
│  │ Centro          │  │                 │           │
│  │ 4 citas hoy     │  │ 2 citas hoy     │           │
│  └─────────────────┘  └─────────────────┘           │
│                                                     │
│         Ver todas las clínicas →                    │
│                                                     │
└─────────────────────────────────────────────────────┘

Clicking a clinic → sets clinic context → dashboard loads
"Ver todas las clínicas" → loads consolidated dashboard

NOTE: This overlay is for DENTISTS with multiple clinics.
OWNER always defaults to "Todas las clínicas" directly,
this picker is optional for owners.

DESIGN: Cards with clinic color accent border,
clinic name, today's appointment count as
quick info. No logo needed. Clean and fast.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADD TO FIGMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Page 1 — Design System:
  + Clinic color system (6 variants)
  + Clinic badge component (sm/md/lg)
  + Color picker component
  + Agenda row with left color border variant

Page 5 — Dashboard:
  + Screen 1A: Owner all-clinics (metrics expanded state)
  + Screen 1A: Owner all-clinics (metrics collapsed state)
  + Screen 1B: Owner single-clinic selected
  + Clinic selector dropdown (open state, 3 clinics)
  + Post-login clinic picker overlay

Page 6 — Patients:
  + Screen 3 updated: patient list with clinic dots column
  + Screen 5 Tab 4 updated: visit list with clinic filter
    and colored left borders

Page 9 — Role variations (update):
  + Owner all-clinics vs owner single-clinic
  + Dentist multi-clinic: what they see vs what's hidden
  + Patient record: owner view vs dentist scoped view
```

---

## Resumen de lo que esto agrega al sistema
```
Schema change:
  clinics.color_hex  ← campo nuevo, migración requerida

Nuevos endpoints necesarios:
  GET /clinics/:id/color        ← para el selector del topbar
  PUT /clinics/:id/color        ← settings del owner
  GET /dashboard/metrics        ← totales + desglose por clínica
  GET /patients?clinicId=:id    ← filtro de pacientes por clínica

Lógica de sesión nueva:
  Guardar clinic_context en el JWT o en session storage
  El selector del topbar actualiza este contexto
  Todas las queries del frontend incluyen el clinic_id activo

Privacidad reforzada:
  user_clinic_roles define exactamente qué ve cada usuario
  El dentista nunca ve visitas fuera de sus clínicas
  El owner ve todo pero con contexto claro de qué clínica es qué