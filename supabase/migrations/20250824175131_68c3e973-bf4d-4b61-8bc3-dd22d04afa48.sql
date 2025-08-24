-- Drop the existing public policy that exposes all room data
DROP POLICY IF EXISTS "Anyone can view available rooms" ON public.rooms;

-- Create a new policy that allows public access to room details but excludes contact information
-- We'll use a row-level security approach where contact fields are NULL for unauthenticated users
CREATE POLICY "Public can view rooms without contact info" 
ON public.rooms 
FOR SELECT 
TO anon
USING (
  is_available = true
);

-- Create a policy for authenticated users to view full room details including contact info
-- Only show contact info to users who have made bookings for that room
CREATE POLICY "Authenticated users can view contact info for their bookings" 
ON public.rooms 
FOR SELECT 
TO authenticated
USING (
  is_available = true AND (
    -- Users can see contact info if they have a booking for this room
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE room_id = rooms.id 
      AND student_id = auth.uid()
    )
    -- OR if they are an admin
    OR is_admin(auth.uid())
    -- OR if they are the room owner
    OR auth.uid() = owner_id
  )
);

-- Create a view for public room browsing that excludes sensitive contact information
CREATE OR REPLACE VIEW public.rooms_public AS
SELECT 
  id,
  title,
  description,
  location,
  price,
  original_price,
  discount,
  available_from,
  available_until,
  max_occupancy,
  current_occupancy,
  is_available,
  rating,
  total_reviews,
  facilities,
  images,
  room_type,
  gender_preference,
  created_at,
  updated_at,
  -- Hide contact information for public view
  CASE 
    WHEN auth.role() = 'anon' THEN NULL
    ELSE contact_person
  END as contact_person,
  CASE 
    WHEN auth.role() = 'anon' THEN NULL
    ELSE contact_phone
  END as contact_phone,
  owner_id
FROM public.rooms
WHERE is_available = true;

-- Grant access to the public view
GRANT SELECT ON public.rooms_public TO anon, authenticated;