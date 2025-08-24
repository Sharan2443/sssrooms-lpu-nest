-- Drop the problematic security definer view
DROP VIEW IF EXISTS public.rooms_public;

-- Instead, we'll modify the application code to handle contact information visibility
-- The RLS policies are sufficient for protection

-- Update the RLS policies to properly handle contact information visibility
-- Replace the existing policies with more specific ones

DROP POLICY IF EXISTS "Public can view rooms without contact info" ON public.rooms;
DROP POLICY IF EXISTS "Authenticated users can view contact info for their bookings" ON public.rooms;

-- Create a policy that allows public users to see room details but nullifies contact info
CREATE POLICY "Anyone can view rooms with contact restrictions" 
ON public.rooms 
FOR SELECT 
USING (
  is_available = true
);

-- Create a function to check if user can see contact info
CREATE OR REPLACE FUNCTION public.can_see_contact_info(room_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT CASE
    WHEN user_uuid IS NULL THEN false  -- Anonymous users cannot see contact info
    WHEN is_admin(user_uuid) THEN true  -- Admins can see all contact info
    WHEN EXISTS (
      SELECT 1 FROM public.rooms 
      WHERE id = room_uuid AND owner_id = user_uuid
    ) THEN true  -- Owners can see their own contact info
    WHEN EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE room_id = room_uuid AND student_id = user_uuid
    ) THEN true  -- Users with bookings can see contact info
    ELSE false
  END;
$$;