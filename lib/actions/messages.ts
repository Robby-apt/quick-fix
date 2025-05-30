"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { z } from "zod"
import { revalidatePath } from "next/cache"

// Validation schemas
export const MessageSchema = z.object({
  receiverId: z.string().uuid({ message: "Invalid receiver ID" }),
  content: z.string().min(1, { message: "Message cannot be empty" }).max(1000, { message: "Message is too long" }),
  bookingId: z.string().uuid({ message: "Invalid booking ID" }).optional(),
})

// Form state types
export type MessageFormState = {
  errors?: {
    receiverId?: string[]
    content?: string[]
    bookingId?: string[]
    _form?: string[]
  }
  message?: string
}

// Send message action
export async function sendMessage(prevState: MessageFormState, formData: FormData) {
  // Validate form data
  const validatedFields = MessageSchema.safeParse({
    receiverId: formData.get("receiverId"),
    content: formData.get("content"),
    bookingId: formData.get("bookingId") || undefined,
  })

  // Return errors if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid message data. Please check the fields.",
    }
  }

  const { receiverId, content, bookingId } = validatedFields.data

  try {
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        errors: {
          _form: ["You must be logged in to send a message."],
        },
      }
    }

    // Get sender profile ID
    const { data: profileData } = await supabase.from("profiles").select("id").eq("user_id", user.id).single()

    if (!profileData) {
      return {
        errors: {
          _form: ["Sender profile not found."],
        },
      }
    }

    // Create message
    const { error } = await supabase.from("messages").insert({
      sender_id: profileData.id,
      receiver_id: receiverId,
      booking_id: bookingId,
      content,
      is_read: false,
    })

    if (error) {
      return {
        errors: {
          _form: [error.message || "Failed to send message. Please try again."],
        },
      }
    }

    // Revalidate messages page
    revalidatePath("/dashboard/client/messages")
    revalidatePath("/dashboard/handyman/messages")

    return {
      message: "Message sent successfully.",
    }
  } catch (error) {
    return {
      errors: {
        _form: ["An unexpected error occurred. Please try again."],
      },
    }
  }
}

// Mark message as read
export async function markMessageAsRead(messageId: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: "You must be logged in to update a message." }
    }

    // Get user profile ID
    const { data: profileData } = await supabase.from("profiles").select("id").eq("user_id", user.id).single()

    if (!profileData) {
      return { success: false, message: "User profile not found." }
    }

    // Get message details
    const { data: messageData } = await supabase.from("messages").select("receiver_id").eq("id", messageId).single()

    if (!messageData) {
      return { success: false, message: "Message not found." }
    }

    // Check if user is the receiver
    if (messageData.receiver_id !== profileData.id) {
      return { success: false, message: "You can only mark messages sent to you as read." }
    }

    // Update message
    const { error } = await supabase.from("messages").update({ is_read: true }).eq("id", messageId)

    if (error) {
      return { success: false, message: error.message || "Failed to mark message as read." }
    }

    // Revalidate messages page
    revalidatePath("/dashboard/client/messages")
    revalidatePath("/dashboard/handyman/messages")

    return { success: true, message: "Message marked as read." }
  } catch (error) {
    return { success: false, message: "An unexpected error occurred. Please try again." }
  }
}

// Get user conversations
export async function getUserConversations(userId: string) {
  const supabase = createServerSupabaseClient()

  // Get all messages where user is sender or receiver
  const { data: messages, error } = await supabase
    .from("messages")
    .select(`
      *,
      sender:sender_id (
        first_name,
        last_name,
        profile_image
      ),
      receiver:receiver_id (
        first_name,
        last_name,
        profile_image
      )
    `)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: false })

  if (error || !messages) {
    console.error("Error fetching user conversations:", error)
    return []
  }

  // Group messages by conversation
  const conversations = messages.reduce((acc, message) => {
    // Determine the other party in the conversation
    const otherPartyId = message.sender_id === userId ? message.receiver_id : message.sender_id
    const otherParty = message.sender_id === userId ? message.receiver : message.sender

    // Check if conversation already exists
    const existingConversation = acc.find((conv) => conv.otherPartyId === otherPartyId)

    if (existingConversation) {
      // Add message to existing conversation
      existingConversation.messages.push(message)

      // Update last message if this is newer
      if (new Date(message.created_at) > new Date(existingConversation.lastMessage.created_at)) {
        existingConversation.lastMessage = message
      }

      // Update unread count if necessary
      if (message.receiver_id === userId && !message.is_read) {
        existingConversation.unreadCount++
      }
    } else {
      // Create new conversation
      acc.push({
        otherPartyId,
        otherParty,
        messages: [message],
        lastMessage: message,
        unreadCount: message.receiver_id === userId && !message.is_read ? 1 : 0,
      })
    }

    return acc
  }, [] as any[])

  // Sort conversations by last message date
  return conversations.sort(
    (a, b) => new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime(),
  )
}

// Get conversation messages
export async function getConversationMessages(userId: string, otherPartyId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("messages")
    .select(`
      *,
      sender:sender_id (
        first_name,
        last_name,
        profile_image
      ),
      receiver:receiver_id (
        first_name,
        last_name,
        profile_image
      ),
      booking:booking_id (
        id,
        services (
          title
        )
      )
    `)
    .or(
      `and(sender_id.eq.${userId},receiver_id.eq.${otherPartyId}),and(sender_id.eq.${otherPartyId},receiver_id.eq.${userId})`,
    )
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching conversation messages:", error)
    return []
  }

  return data || []
}
