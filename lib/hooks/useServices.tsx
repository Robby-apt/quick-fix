"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api/client"

interface Service {
  id: string
  title: string
  description: string
  category: string
  price_type: "hourly" | "fixed"
  base_price: number
  handyman_id: string
  first_name?: string
  last_name?: string
  profile_image?: string
  experience_years?: number
  is_verified?: boolean
}

export function useServices(params?: {
  category?: string
  q?: string
  handyman?: string
}) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchServices()
  }, [params?.category, params?.q, params?.handyman])

  const fetchServices = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getServices(params)
      setServices(response.services)
    } catch (error) {
      setError("Failed to fetch services")
      console.error("Error fetching services:", error)
    } finally {
      setLoading(false)
    }
  }

  const createService = async (data: {
    title: string
    description: string
    category: string
    priceType: "hourly" | "fixed"
    basePrice: number
  }) => {
    try {
      const response = await apiClient.createService(data)
      await fetchServices() // Refresh the list
      return response
    } catch (error) {
      throw error
    }
  }

  return {
    services,
    loading,
    error,
    createService,
    refetch: fetchServices,
  }
}
