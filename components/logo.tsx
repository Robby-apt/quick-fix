import Link from "next/link"
import { Wrench } from "lucide-react"

interface LogoProps {
  variant?: "default" | "white"
  size?: "sm" | "md" | "lg"
}

export default function Logo({ variant = "default", size = "md" }: LogoProps) {
  const textColor = variant === "white" ? "text-white" : "text-primary"

  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  }

  return (
    <Link href="/" className={`flex items-center gap-2 font-bold ${textColor} ${sizeClasses[size]}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-primary rounded-full opacity-20"></div>
        <Wrench size={iconSize[size]} className={variant === "white" ? "text-white" : "text-primary"} />
      </div>
      <span>QuickFix</span>
    </Link>
  )
}
