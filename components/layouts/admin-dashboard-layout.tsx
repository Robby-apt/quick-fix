"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  AlertCircle,
  Bell,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  User,
  Users,
  Wrench,
} from "lucide-react"
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

interface AdminDashboardLayoutProps {
  children: ReactNode
}

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isActive = (path: string) => pathname === path

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/admin",
    },
    {
      icon: Users,
      label: "Users",
      href: "/admin/users",
    },
    {
      icon: Wrench,
      label: "Service Providers",
      href: "/admin/providers",
    },
    {
      icon: AlertCircle,
      label: "Support Tickets",
      href: "/admin/tickets",
    },
    {
      icon: ShieldCheck,
      label: "Verification",
      href: "/admin/verification",
    },
  ]

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const userInitials = user ? `${user.profile.first_name[0]}${user.profile.last_name[0]}` : "AD"

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <Logo />
              <Badge variant="secondary">Admin</Badge>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
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
              <SidebarGroupLabel>System</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/admin/settings")} tooltip="Settings">
                      <Link href="/admin/settings">
                        <Settings />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="View Site">
                      <a href="/" target="_blank" rel="noopener noreferrer">
                        <Home />
                        <span>View Site</span>
                      </a>
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
                  <AvatarImage src={user?.profile.profile_image || "/placeholder.svg"} alt="Admin" />
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

              <div className="ml-auto flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                        12
                      </Badge>
                      <span className="sr-only">Notifications</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>System Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <span>New service provider awaiting verification</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>5 new support tickets opened</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>System update available</span>
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
                        <AvatarImage src={user?.profile.profile_image || "/placeholder.svg"} alt="Admin" />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                      </Avatar>
                      <span className="sr-only">User menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
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
