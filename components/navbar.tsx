"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/logo"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/hooks/useAuth"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout, loading } = useAuth()

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ]

  const isActive = (path: string) => pathname === path

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <div className="w-20 h-9 bg-muted animate-pulse rounded" />
            ) : user ? (
              <>
                <Button variant="outline" asChild>
                  <Link
                    href={
                      user.role === "admin"
                        ? "/admin"
                        : user.role === "handyman"
                          ? "/dashboard/handyman"
                          : "/dashboard/client"
                    }
                  >
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" onClick={handleLogout}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register/client">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden py-4 px-4 border-t">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              {user ? (
                <>
                  <Button variant="outline" asChild>
                    <Link
                      href={
                        user.role === "admin"
                          ? "/admin"
                          : user.role === "handyman"
                            ? "/dashboard/handyman"
                            : "/dashboard/client"
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      Log In
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register/client" onClick={() => setIsMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
