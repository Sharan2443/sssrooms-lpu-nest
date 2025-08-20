-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  university_id TEXT,
  year_of_study INTEGER,
  course TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rooms table
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER,
  discount INTEGER,
  room_type TEXT NOT NULL CHECK (room_type IN ('single', 'double', 'triple', 'shared')),
  gender_preference TEXT CHECK (gender_preference IN ('male', 'female', 'mixed')),
  available_from DATE,
  available_until DATE,
  max_occupancy INTEGER NOT NULL DEFAULT 1,
  current_occupancy INTEGER NOT NULL DEFAULT 0,
  facilities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  contact_person TEXT,
  contact_phone TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  owner_id UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE,
  total_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(room_id, student_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND is_admin = TRUE
    )
  );

-- Rooms policies
CREATE POLICY "Anyone can view available rooms" ON public.rooms
  FOR SELECT USING (is_available = TRUE);

CREATE POLICY "Admins and owners can manage rooms" ON public.rooms
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND (is_admin = TRUE OR user_id = rooms.owner_id)
    )
  );

CREATE POLICY "Admins can insert rooms" ON public.rooms
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND is_admin = TRUE
    )
  );

-- Bookings policies
CREATE POLICY "Students can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND is_admin = TRUE
    )
  );

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (TRUE);

CREATE POLICY "Students can create reviews for their bookings" ON public.reviews
  FOR INSERT WITH CHECK (
    auth.uid() = student_id AND 
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE id = reviews.booking_id AND student_id = auth.uid()
    )
  );

CREATE POLICY "Students can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = student_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update room rating when reviews are added
CREATE OR REPLACE FUNCTION public.update_room_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.rooms
  SET 
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 1)
      FROM public.reviews
      WHERE room_id = COALESCE(NEW.room_id, OLD.room_id)
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE room_id = COALESCE(NEW.room_id, OLD.room_id)
    )
  WHERE id = COALESCE(NEW.room_id, OLD.room_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update room rating on review changes
CREATE TRIGGER update_room_rating_on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_room_rating();

-- Insert sample data
INSERT INTO public.rooms (title, description, location, price, original_price, discount, room_type, gender_preference, facilities, images, contact_person, contact_phone, rating, total_reviews) VALUES
('Luxury Single Room with AC', 'Spacious single room with modern amenities perfect for LPU students', '500m from LPU Gate', 12000, 15000, 20, 'single', 'mixed', ARRAY['WiFi', 'AC', 'Meals', 'Parking'], ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop'], 'Rajesh Kumar', '+91 98765 43210', 4.8, 127),
('Cozy Shared Room for Girls', 'Safe and comfortable shared accommodation near university', 'Near University Market', 8000, NULL, NULL, 'shared', 'female', ARRAY['WiFi', 'Meals', 'Laundry'], ARRAY['https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=400&h=250&fit=crop'], 'Priya Sharma', '+91 87654 32109', 4.6, 89),
('Premium Studio Apartment', 'Independent studio with kitchen and modern facilities', 'Walking Distance to LPU', 18000, 20000, 10, 'single', 'mixed', ARRAY['WiFi', 'Kitchen', 'Parking', 'Gym'], ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop'], 'Amit Singh', '+91 76543 21098', 4.9, 156),
('Boys Hostel - Triple Sharing', 'Affordable triple sharing room with study facilities', 'LPU Campus Area', 6500, NULL, NULL, 'triple', 'male', ARRAY['WiFi', 'Meals', 'Study Room'], ARRAY['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=250&fit=crop'], 'Suresh Gupta', '+91 65432 10987', 4.4, 203),
('Modern Single Room with Balcony', 'Bright single room with balcony and city views', 'Phagwara City Center', 14000, NULL, NULL, 'single', 'mixed', ARRAY['WiFi', 'AC', 'Balcony', 'Parking'], ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=250&fit=crop'], 'Neha Patel', '+91 54321 09876', 4.7, 91),
('Budget Friendly Double Room', 'Affordable double sharing with basic amenities', 'Near LPU Back Gate', 9500, 11000, 15, 'double', 'mixed', ARRAY['WiFi', 'Meals', 'Common Area'], ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=250&fit=crop'], 'Ravi Mehta', '+91 43210 98765', 4.3, 64);