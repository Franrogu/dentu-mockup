# DentalOS - Sistema de Colores de Especialidades

## Descripción

Este archivo define el sistema de colores de especialidades utilizado consistentemente en toda la aplicación DentalOS. Los colores están diseñados para cumplir con WCAG AA en contraste sobre fondo blanco.

## Uso

```typescript
import { getSpecialtyColor, specialtyColors } from './constants/specialties';

// Usar el helper function
<Badge className={getSpecialtyColor(visit.specialty)}>
  {visit.specialty}
</Badge>

// O acceder directamente a los tokens
<div className={specialtyColors.Ortodoncia.full}>
  Ortodoncia
</div>
```

## Especialidades y Colores

| Especialidad | Color Base | Uso Principal |
|--------------|-----------|---------------|
| **General** | Gris | Consultas generales, limpiezas básicas |
| **Ortodoncia** | Púrpura | Brackets, alineadores, correcciones dentales |
| **Endodoncia** | Naranja | Tratamientos de conducto, pulpa dental |
| **Periodoncia** | Verde | Tratamiento de encías y tejidos de soporte |
| **Cirugía** | Rojo | Extracciones, cirugía oral |
| **Implantología** | Azul | Colocación de implantes dentales |
| **Prostodoncia** | Índigo | Prótesis, coronas, puentes |
| **Odontopediatría** | Rosa | Tratamientos pediátricos |

## Lugares donde se usa

- Filas de visitas en historial del paciente
- Tabs de formularios de visita (multi-especialidad)
- Lista de agenda
- Filtros de expediente del paciente
- Dashboard de visitas
- Badges en cualquier vista que muestre especialidades

## Tokens de Color

Cada especialidad tiene cuatro tokens:

- `bg`: Clase de background (ej: `bg-purple-100`)
- `text`: Clase de texto (ej: `text-purple-800`)
- `border`: Clase de borde (ej: `border-purple-200`)
- `full`: Combinación completa de las tres clases anteriores

## Accesibilidad

Todos los colores cumplen con el estándar **WCAG AA** para contraste de texto sobre fondo blanco. Esto asegura legibilidad para usuarios con deficiencias visuales.

## Extender el Sistema

Para agregar una nueva especialidad:

1. Agregar entrada en `specialtyColors` con el formato correcto
2. Asegurarse que los colores cumplan WCAG AA
3. Actualizar este README con la nueva especialidad
4. Actualizar los filtros en las vistas que usan especialidades
