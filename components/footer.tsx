import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import Logo from "@/components/logo"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-gray-400 text-sm">
              Connecting clients with skilled handymen for all your home repair and maintenance needs.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-primary text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/plumbing" className="text-gray-400 hover:text-primary text-sm">
                  Plumbing
                </Link>
              </li>
              <li>
                <Link href="/services/electrical" className="text-gray-400 hover:text-primary text-sm">
                  Electrical
                </Link>
              </li>
              <li>
                <Link href="/services/roofing" className="text-gray-400 hover:text-primary text-sm">
                  Roofing
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-primary text-sm">
                  View All
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <address className="not-italic text-gray-400 space-y-2 text-sm">
              <p>123 Main Street</p>
              <p>New York, NY 10001</p>
              <p>Email: info@quickfix.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Quick Fix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
