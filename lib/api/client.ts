// API client for making requests to our backend

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: any,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NODE_ENV === "production" ? "https://your-domain.com" : "http://localhost:3000"
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // Include cookies for session
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new ApiError(response.status, data.error || "An error occurred", data.details)
      }

      return data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError(500, "Network error occurred")
    }
  }

  // Authentication
  async registerClient(data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    zip: string
    password: string
  }) {
    return this.request("/auth/register/client", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async registerHandyman(data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    zip: string
    serviceCategory: string
    experience: string
    serviceArea: string
    bio: string
    password: string
  }) {
    return this.request("/auth/register/handyman", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    })
  }

  async getCurrentUser() {
    return this.request("/auth/me")
  }

  // Services
  async createService(data: {
    title: string
    description: string
    category: string
    priceType: "hourly" | "fixed"
    basePrice: number
  }) {
    return this.request("/services", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getServices(params?: {
    category?: string
    q?: string
    handyman?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.set("category", params.category)
    if (params?.q) searchParams.set("q", params.q)
    if (params?.handyman) searchParams.set("handyman", params.handyman)

    const query = searchParams.toString()
    return this.request(`/services${query ? `?${query}` : ""}`)
  }

  // Bookings
  async createBooking(data: {
    serviceId: string
    date: string
    timeSlot: string
    address: string
    city: string
    zip: string
    notes?: string
  }) {
    return this.request("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getBookings() {
    return this.request("/bookings")
  }

  async updateBookingStatus(bookingId: string, status: "pending" | "confirmed" | "completed" | "cancelled") {
    return this.request(`/bookings/${bookingId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  }

  // Reviews
  async createReview(data: {
    bookingId: string
    rating: number
    comment: string
  }) {
    return this.request("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Messages
  async sendMessage(data: {
    receiverId: string
    content: string
    bookingId?: string
  }) {
    return this.request("/messages", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getConversations() {
    return this.request("/messages")
  }

  async getConversationMessages(otherPartyId: string) {
    return this.request(`/messages?with=${otherPartyId}`)
  }

  // Admin
  async getAdminStats() {
    return this.request("/admin/stats")
  }

  async verifyHandyman(handymanId: string) {
    return this.request("/admin/verify-handyman", {
      method: "POST",
      body: JSON.stringify({ handymanId }),
    })
  }
}

export const apiClient = new ApiClient()
