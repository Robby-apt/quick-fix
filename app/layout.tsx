import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/hooks/useAuth"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: 'Quick Fix - Connect with Local Handymen',
	description:
		'Find skilled handymen in your area for plumbing, electrical, roofing and more.',
	keywords: [
		'handyman services',
		'local handymen',
		'plumbing',
		'electrical',
		'roofing',
		'home repair',
		'quick fix',
		'find handyman',
	],
	icons: {
		icon: '/images/quick-fix.svg',
		shortcut: '/images/quick-fix.svg',
		apple: '/images/quick-fix.svg',
	},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
