// lib/api/client.ts
interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
    details?: any;
  }
  
  export class ApiError extends Error {
    constructor(
      public status: number,
      message: string,
      public details?: any,
    ) {
      super(message);
      this.name = "ApiError";
      Object.setPrototypeOf(this, ApiError.prototype);
    }
  
    static isApiError(error: unknown): error is ApiError {
      return error instanceof ApiError;
    }
  }
  
  class ApiClient {
    private baseUrl: string;
  
    constructor() {
      this.baseUrl = process.env.NODE_ENV === "production" 
        ? "https://your-production-domain.com" 
        : "http://localhost:3000";
    }
  
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
      const url = `${this.baseUrl}/api${endpoint}`;
      const headers = new Headers({
        "Content-Type": "application/json",
        ...(options.headers || {}),
      });
  
      // Add auth token if available
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
  
      const config: RequestInit = {
        headers,
        credentials: "include",
        ...options,
      };
  
      try {
        const response = await fetch(url, config);
        
        // Handle empty responses
        if (response.status === 204) {
          return {} as T;
        }
  
        const data = await response.json().catch(() => ({}));
  
        if (!response.ok) {
          throw new ApiError(
            response.status,
            data?.error || response.statusText || "Request failed",
            data?.details
          );
        }
  
        return data;
      } catch (error) {
        if (ApiError.isApiError(error)) {
          throw error;
        }
        throw new ApiError(500, "Network error occurred", { originalError: error });
      }
    }
  
    // ========== Authentication ==========
    async registerClient(data: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      zip: string;
      password: string;
    }): Promise<ApiResponse<{ user: any; token?: string }>> {
      return this.request("/auth/register/client", {
        method: "POST",
        body: JSON.stringify(data),
      });
    }
  
    async registerHandyman(data: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      zip: string;
      serviceCategory: string;
      experience: string;
      serviceArea: string;
      bio: string;
      password: string;
    }): Promise<ApiResponse<{ user: any; token?: string }>> {
      return this.request("/auth/register/handyman", {
        method: "POST",
        body: JSON.stringify(data),
      });
    }
  
    async login(email: string, password: string): Promise<ApiResponse<{ user: any; token: string }>> {
      return this.request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
    }
  
    async logout(): Promise<ApiResponse<void>> {
      return this.request("/auth/logout", {
        method: "POST",
      });
    }
  
    async getCurrentUser(): Promise<ApiResponse<{ user: any }>> {
      return this.request("/auth/me");
    }
  
    // ========== Services ==========
    async createService(data: {
      title: string;
      description: string;
      category: string;
      priceType: "hourly" | "fixed";
      basePrice: number;
    }): Promise<ApiResponse<{ service: any }>> {
      return this.request("/services", {
        method: "POST",
        body: JSON.stringify(data),
      });
    }
  
    async getServices(params?: {
      category?: string;
      q?: string;
      handyman?: string;
    }): Promise<ApiResponse<{ services: any[] }>> {
      const query = new URLSearchParams();
      if (params?.category) query.set("category", params.category);
      if (params?.q) query.set("q", params.q);
      if (params?.handyman) query.set("handyman", params.handyman);
  
      return this.request(`/services?${query.toString()}`);
    }
  
    // ========== Bookings ==========
    async createBooking(data: {
      serviceId: string;
      date: string;
      timeSlot: string;
      address: string;
      city: string;
      zip: string;
      notes?: string;
    }): Promise<ApiResponse<{ booking: any }>> {
      return this.request("/bookings", {
        method: "POST",
        body: JSON.stringify(data),
      });
    }
  
    async getBookings(): Promise<ApiResponse<{ bookings: any[] }>> {
      return this.request("/bookings");
    }
  
    async updateBookingStatus(
      bookingId: string,
      status: "pending" | "confirmed" | "completed" | "cancelled"
    ): Promise<ApiResponse<{ booking: any }>> {
      return this.request(`/bookings/${bookingId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    }
  
    // ========== Reviews ==========
    async createReview(data: {
      bookingId: string;
      rating: number;
      comment: string;
    }): Promise<ApiResponse<{ review: any }>> {
      return this.request("/reviews", {
        method: "POST",
        body: JSON.stringify(data),
      });
    }
  
    // ========== Messages ==========
    async sendMessage(data: {
      receiverId: string;
      content: string;
      bookingId?: string;
    }): Promise<ApiResponse<{ message: any }>> {
      return this.request("/messages", {
        method: "POST",
        body: JSON.stringify(data),
      });
    }
  
    async getConversations(): Promise<ApiResponse<{ conversations: any[] }>> {
      return this.request("/messages");
    }
  
    async getConversationMessages(
      otherPartyId: string
    ): Promise<ApiResponse<{ messages: any[] }>> {
      return this.request(`/messages?with=${otherPartyId}`);
    }
  
    // ========== Admin ==========
    async getAdminStats(): Promise<ApiResponse<{ stats: any }>> {
      return this.request("/admin/stats");
    }
  
    async verifyHandyman(handymanId: string): Promise<ApiResponse<{ user: any }>> {
      return this.request("/admin/verify-handyman", {
        method: "POST",
        body: JSON.stringify({ handymanId }),
      });
    }
  }
  
  export const apiClient = new ApiClient();