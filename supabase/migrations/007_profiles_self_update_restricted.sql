-- Zero Limit: Block privilege escalation via "Users can update own profile"
-- CRITICAL: any authenticated user could previously change their own role
-- to admin/super_admin because the update policy had no WITH CHECK on role.
-- Idempotent: safe to run repeatedly in Supabase SQL Editor.

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (
    auth.uid() = id
  )
  WITH CHECK (
    auth.uid() = id
    AND role IS NOT DISTINCT FROM (
      SELECT role FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Admins/super_admins keep full control of profiles via 005's
-- "Admins can update profiles" policy (public.is_admin()).