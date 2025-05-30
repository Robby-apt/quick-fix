-- SQLite schema for Quick Fix application
-- Run this to set up your local database

-- Users table (for authentication)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('client', 'handyman', 'admin')) DEFAULT 'client',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Profiles table
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  zip TEXT,
  bio TEXT,
  profile_image TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Handyman profiles (extends profiles)
CREATE TABLE handyman_profiles (
  id TEXT PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  service_category TEXT NOT NULL,
  experience_years INTEGER NOT NULL,
  service_area INTEGER NOT NULL, -- in miles
  hourly_rate DECIMAL(10, 2),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Service categories
CREATE TABLE service_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Services offered by handymen
CREATE TABLE services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price_type TEXT NOT NULL CHECK (price_type IN ('hourly', 'fixed')) DEFAULT 'hourly',
  base_price DECIMAL(10, 2) NOT NULL,
  handyman_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bookings
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  handyman_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_id TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  zip TEXT NOT NULL,
  notes TEXT,
  price DECIMAL(10, 2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Reviews
CREATE TABLE reviews (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  handyman_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Messages
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  booking_id TEXT REFERENCES bookings(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Support tickets
CREATE TABLE support_tickets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')) DEFAULT 'open',
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

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

-- Insert default service categories
INSERT INTO service_categories (id, name, description, icon) VALUES
('plumbing', 'Plumbing', 'Professional plumbing services for all your needs', 'wrench'),
('electrical', 'Electrical', 'Certified electricians for safe and reliable electrical work', 'zap'),
('roofing', 'Roofing', 'Expert roofing services to protect your home', 'home'),
('carpentry', 'Carpentry', 'Skilled carpenters for all your woodworking needs', 'hammer'),
('painting', 'Painting', 'Professional painting services for interior and exterior', 'paintbrush'),
('cleaning', 'Cleaning', 'Professional cleaning services for homes and offices', 'sparkles');

-- Insert admin user (password: admin123)
INSERT INTO users (id, email, password_hash, role) VALUES
('admin-1', 'admin@quickfix.com', '$2b$10$rOvHPxfzO2.KjB8YvFR8/.vQZGZ8qBqOqBqOqBqOqBqOqBqOqBqO', 'admin');

INSERT INTO profiles (id, user_id, first_name, last_name, phone, address, city, zip) VALUES
('admin-profile-1', 'admin-1', 'Admin', 'User', '(555) 000-0000', '123 Admin St', 'New York', '10001');
