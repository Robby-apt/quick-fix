"use client"

import { type ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Calendar, CreditCard, Home, LogOut, MessageSquare, Search, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Logo from "@/components/logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/hooks/useAuth"

interface ClientDashboardLayoutProps {
  children: ReactNode
}

export default function ClientDashboardLayout({ children }: ClientDashboardLayoutProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [notifications, setNotifications] = useState(3)

  const isActive = (path: string) => pathname === path

  const menuItems = [
    {
      icon: Home,
      label: "Dashboard",
      href: "/dashboard/client",
    },
    {
      icon: Search,
      label: "Find Services",
      href: "/services",
    },
    {
      icon: Calendar,
      label: "Appointments",
      href: "/dashboard/client/appointments",
    },
    {
      icon: MessageSquare,
      label: "Messages",
      href: "/dashboard/client/messages",
    },
    {
      icon: CreditCard,
      label: "Payments",
      href: "/dashboard/client/payments",
    },
  ]

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const userInitials = user ? `${user.profile.first_name[0]}${user.profile.last_name[0]}` : "U"

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.label}>
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/dashboard/client/profile")} tooltip="Profile">
                      <Link href="/dashboard/client/profile">
                        <User />
                        <span>Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/dashboard/client/settings")} tooltip="Settings">
                      <Link href="/dashboard/client/settings">
                        <Settings />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user?.profile.profile_image || "/placeholder.svg"} alt="User" />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div className="group-data-[collapsible=icon]:hidden">
                  <p className="text-sm font-medium">
                    {user?.profile.first_name} {user?.profile.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="group-data-[collapsible=icon]:hidden"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Log out</span>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="border-b bg-background">
            <div className="flex h-16 items-center px-4 gap-4">
              <SidebarTrigger />

              <div className="flex-1 md:flex-none md:w-80">
                <Input placeholder="Search..." className="h-9" />
              </div>

              <div className="ml-auto flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {notifications > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                          {notifications}
                        </Badge>
                      )}
                      <span className="sr-only">Notifications</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <span>New message from Michael Smith</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Appointment confirmed for March 15</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Your service request has been accepted</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="justify-center">
                      <span>View all notifications</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profile.profile_image || "/placeholder.svg"} alt="User" />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                      </Avatar>
                      <span className="sr-only">User menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
