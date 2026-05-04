-- 018_booking_internal_provisioning_optional.sql
-- Opcional. El schema del modulo queda valido sin ejecutar este archivo.
-- Ejecutar solo como owner de las tablas involucradas o con un rol que tenga BYPASSRLS.
-- Contiene backfill de settings y seed RBAC separados del 018 principal para no mezclar
-- estructura con datos existentes ni requerir privilegios elevados en la migracion base.

SET search_path TO dental, public;

-- =========================================================
-- 1) BACKFILL DE SETTINGS PARA CLINICAS EXISTENTES
-- =========================================================
DO $$
DECLARE
  v_has_bypassrls     boolean;
  v_is_clinics_owner  boolean;
  v_is_settings_owner boolean;
BEGIN
  SELECT r.rolbypassrls
    INTO v_has_bypassrls
    FROM pg_roles r
   WHERE r.rolname = current_user;

  SELECT pg_get_userbyid(c.relowner) = current_user
    INTO v_is_clinics_owner
    FROM pg_class c
   WHERE c.oid = 'dental.clinics'::regclass;

  SELECT pg_get_userbyid(c.relowner) = current_user
    INTO v_is_settings_owner
    FROM pg_class c
   WHERE c.oid = 'dental.clinic_booking_settings'::regclass;

  IF NOT coalesce(v_has_bypassrls, false)
     AND NOT (coalesce(v_is_clinics_owner, false) AND coalesce(v_is_settings_owner, false)) THEN
    RAISE EXCEPTION
      'booking settings backfill requires BYPASSRLS or ownership of dental.clinics and dental.clinic_booking_settings';
  END IF;

  IF NOT coalesce(v_has_bypassrls, false) THEN
    EXECUTE 'ALTER TABLE dental.clinics NO FORCE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE dental.clinic_booking_settings NO FORCE ROW LEVEL SECURITY';
  END IF;

  INSERT INTO dental.clinic_booking_settings (org_id, clinic_id)
  SELECT c.org_id, c.id
  FROM dental.clinics c
  ON CONFLICT (org_id, clinic_id) DO NOTHING;

  IF NOT coalesce(v_has_bypassrls, false) THEN
    EXECUTE 'ALTER TABLE dental.clinics FORCE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE dental.clinic_booking_settings FORCE ROW LEVEL SECURITY';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    IF NOT coalesce(v_has_bypassrls, false) THEN
      BEGIN
        EXECUTE 'ALTER TABLE dental.clinics FORCE ROW LEVEL SECURITY';
      EXCEPTION
        WHEN OTHERS THEN
          NULL;
      END;
      BEGIN
        EXECUTE 'ALTER TABLE dental.clinic_booking_settings FORCE ROW LEVEL SECURITY';
      EXCEPTION
        WHEN OTHERS THEN
          NULL;
      END;
    END IF;
    RAISE;
END;
$$;

-- =========================================================
-- 2) PERMISOS RBAC DE BOOKING
-- =========================================================
-- Este bloque asume que existen roles globales con codigos:
-- ORG_ADMIN, CLINIC_MANAGER, DENTIST, ASSISTANT.
-- Si tu seed usa otros codigos, ajustalo aqui o muevelo a tu seed global.
DO $$
DECLARE
  v_has_bypassrls        boolean;
  v_is_permissions_owner boolean;
  v_is_role_perms_owner  boolean;
BEGIN
  SELECT r.rolbypassrls
    INTO v_has_bypassrls
    FROM pg_roles r
   WHERE r.rolname = current_user;

  SELECT pg_get_userbyid(c.relowner) = current_user
    INTO v_is_permissions_owner
    FROM pg_class c
   WHERE c.oid = 'dental.permissions'::regclass;

  SELECT pg_get_userbyid(c.relowner) = current_user
    INTO v_is_role_perms_owner
    FROM pg_class c
   WHERE c.oid = 'dental.role_permissions'::regclass;

  IF NOT coalesce(v_has_bypassrls, false)
     AND NOT (coalesce(v_is_permissions_owner, false) AND coalesce(v_is_role_perms_owner, false)) THEN
    RAISE EXCEPTION
      'booking RBAC seed requires BYPASSRLS or ownership of dental.permissions and dental.role_permissions';
  END IF;

  IF NOT coalesce(v_has_bypassrls, false) THEN
    EXECUTE 'ALTER TABLE dental.permissions NO FORCE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE dental.role_permissions NO FORCE ROW LEVEL SECURITY';
  END IF;

  INSERT INTO dental.permissions (code, module_name, action_name, description, status)
  VALUES
    ('appointments.read', 'appointments', 'read', 'Leer agenda y citas', 'active'),
    ('appointments.write', 'appointments', 'write', 'Crear y editar citas', 'active'),
    ('appointments.cancel', 'appointments', 'cancel', 'Cancelar citas', 'active'),
    ('appointments.check_in', 'appointments', 'check_in', 'Marcar llegada de paciente', 'active'),
    ('appointments.mark_no_show', 'appointments', 'mark_no_show', 'Marcar cita como no show', 'active'),
    ('booking_settings.read', 'booking_settings', 'read', 'Leer configuracion de booking por clinica', 'active'),
    ('booking_settings.write', 'booking_settings', 'write', 'Editar configuracion de booking por clinica', 'active')
  ON CONFLICT (code) DO NOTHING;

  INSERT INTO dental.role_permissions (role_id, permission_id)
  SELECT r.id, p.id
  FROM dental.roles r
  JOIN dental.permissions p ON p.code IN (
    'appointments.read',
    'appointments.write',
    'appointments.cancel',
    'appointments.check_in',
    'appointments.mark_no_show',
    'booking_settings.read',
    'booking_settings.write'
  )
  WHERE r.code = 'ORG_ADMIN'
  ON CONFLICT DO NOTHING;

  INSERT INTO dental.role_permissions (role_id, permission_id)
  SELECT r.id, p.id
  FROM dental.roles r
  JOIN dental.permissions p ON p.code IN (
    'appointments.read',
    'appointments.write',
    'appointments.cancel',
    'appointments.check_in',
    'appointments.mark_no_show',
    'booking_settings.read'
  )
  WHERE r.code = 'CLINIC_MANAGER'
  ON CONFLICT DO NOTHING;

  INSERT INTO dental.role_permissions (role_id, permission_id)
  SELECT r.id, p.id
  FROM dental.roles r
  JOIN dental.permissions p ON p.code IN (
    'appointments.read',
    'appointments.write',
    'appointments.check_in',
    'appointments.mark_no_show'
  )
  WHERE r.code = 'DENTIST'
  ON CONFLICT DO NOTHING;

  INSERT INTO dental.role_permissions (role_id, permission_id)
  SELECT r.id, p.id
  FROM dental.roles r
  JOIN dental.permissions p ON p.code IN (
    'appointments.read',
    'appointments.write',
    'appointments.cancel',
    'appointments.check_in',
    'appointments.mark_no_show'
  )
  WHERE r.code = 'ASSISTANT'
  ON CONFLICT DO NOTHING;

  IF NOT coalesce(v_has_bypassrls, false) THEN
    EXECUTE 'ALTER TABLE dental.permissions FORCE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE dental.role_permissions FORCE ROW LEVEL SECURITY';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    IF NOT coalesce(v_has_bypassrls, false) THEN
      BEGIN
        EXECUTE 'ALTER TABLE dental.permissions FORCE ROW LEVEL SECURITY';
      EXCEPTION
        WHEN OTHERS THEN
          NULL;
      END;
      BEGIN
        EXECUTE 'ALTER TABLE dental.role_permissions FORCE ROW LEVEL SECURITY';
      EXCEPTION
        WHEN OTHERS THEN
          NULL;
      END;
    END IF;
    RAISE;
END;
$$;
