-- Fix infinite recursion in RLS policies by creating a security definer function
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = user_uuid AND is_admin = true
  );
$$;

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins and owners can manage rooms" ON public.rooms;
DROP POLICY IF EXISTS "Admins can insert rooms" ON public.rooms;

-- Recreate policies using the security definer function
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins and owners can manage rooms" ON public.rooms
  FOR ALL USING (public.is_admin(auth.uid()) OR auth.uid() = owner_id);

CREATE POLICY "Admins can insert rooms" ON public.rooms
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

-- Update auth context to handle email verification redirects
CREATE OR REPLACE FUNCTION public.handle_email_verification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function can be used for any post-verification logic
  -- For now, we'll just ensure the user profile exists
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    -- Email was just confirmed, ensure profile exists
    INSERT INTO public.profiles (user_id, full_name, email)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''), NEW.email)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for email verification
CREATE TRIGGER on_auth_email_verified
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_email_verification();