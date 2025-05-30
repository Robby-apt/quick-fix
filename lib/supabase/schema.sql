-- Create tables for the Quick Fix application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('client', 'handyman', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE price_type AS ENUM ('hourly', 'fixed');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  zip TEXT,
  bio TEXT,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Handyman profiles (extends profiles)
CREATE TABLE public.handyman_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  service_category TEXT NOT NULL,
  experience_years INTEGER NOT NULL,
  service_area INTEGER NOT NULL, -- in miles
  hourly_rate DECIMAL(10, 2),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service categories
CREATE TABLE public.service_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services offered by handymen
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price_type price_type NOT NULL DEFAULT 'hourly',
  base_price DECIMAL(10, 2) NOT NULL,
  handyman_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  handyman_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  status booking_status NOT NULL DEFAULT 'pending',
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  zip TEXT NOT NULL,
  notes TEXT,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  handyman_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handyman_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Handyman profiles policies
CREATE POLICY "Handyman profiles are viewable by everyone" 
  ON public.handyman_profiles FOR SELECT USING (true);

CREATE POLICY "Handymen can update own profile" 
  ON public.handyman_profiles FOR UPDATE 
  USING (auth.uid() IN (SELECT user_id FROM profiles WHERE id = handyman_profiles.id));

-- Service categories policies
CREATE POLICY "Service categories are viewable by everyone" 
  ON public.service_categories FOR SELECT USING (true);

-- Services policies
CREATE POLICY "Services are viewable by everyone" 
  ON public.services FOR SELECT USING (true);

CREATE POLICY "Handymen can create their own services" 
  ON public.services FOR INSERT 
  WITH CHECK (auth.uid() IN (SELECT user_id FROM profiles WHERE id = handyman_id));

CREATE POLICY "Handymen can update their own services" 
  ON public.services FOR UPDATE 
  USING (auth.uid() IN (SELECT user_id FROM profiles WHERE id = handyman_id));

-- Bookings policies
CREATE POLICY "Users can view their own bookings" 
  ON public.bookings FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = client_id
      UNION
      SELECT user_id FROM profiles WHERE id = handyman_id
    )
  );

CREATE POLICY "Clients can create bookings" 
  ON public.bookings FOR INSERT 
  WITH CHECK (auth.uid() IN (SELECT user_id FROM profiles WHERE id = client_id));

CREATE POLICY "Users can update their own bookings" 
  ON public.bookings FOR UPDATE 
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = client_id
      UNION
      SELECT user_id FROM profiles WHERE id = handyman_id
    )
  );

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" 
  ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Clients can create reviews for completed bookings" 
  ON public.reviews FOR INSERT 
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM profiles WHERE id = client_id) AND
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = booking_id AND 
            bookings.status = 'completed' AND
            bookings.client_id = client_id
    )
  );

-- Messages policies
CREATE POLICY "Users can view their own messages" 
  ON public.messages FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = sender_id
      UNION
      SELECT user_id FROM profiles WHERE id = receiver_id
    )
  );

CREATE POLICY "Users can send messages" 
  ON public.messages FOR INSERT 
  WITH CHECK (auth.uid() IN (SELECT user_id FROM profiles WHERE id = sender_id));

-- Create indexes for performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_services_handyman_id ON services(handyman_id);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_handyman_id ON bookings(handyman_id);
CREATE INDEX idx_bookings_service_id ON bookings(service_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_handyman_id ON reviews(handyman_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
