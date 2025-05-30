export type UserRole = "client" | "handyman" | "admin"

export interface User {
  id: string
  email: string
  role: UserRole
  created_at: string
}

export interface Profile {
  id: string
  user_id: string
  first_name: string
  last_name: string
  phone: string
  address: string
  city: string
  zip: string
  bio?: string
  profile_image?: string
  created_at: string
  updated_at: string
}

export interface HandymanProfile extends Profile {
  service_category: string
  experience_years: number
  service_area: number
  hourly_rate?: number
  is_verified: boolean
}

export interface Service {
  id: string
  title: string
  description: string
  category: string
  price_type: "hourly" | "fixed"
  base_price: number
  handyman_id: string
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  client_id: string
  handyman_id: string
  service_id: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  date: string
  time_slot: string
  address: string
  city: string
  zip: string
  notes?: string
  price: number
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  booking_id: string
  client_id: string
  handyman_id: string
  rating: number
  comment: string
  created_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  booking_id?: string
  content: string
  is_read: boolean
  created_at: string
}

export interface ServiceCategory {
  id: string
  name: string
  description: string
  icon: string
}
