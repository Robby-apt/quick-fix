import type { ReactNode } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface ServiceCardProps {
  title: string
  icon: ReactNode
  description: string
}

export default function ServiceCard({ title, icon, description }: ServiceCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-col items-center pb-2">
        {icon}
        <h3 className="text-xl font-semibold mt-4">{title}</h3>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground">
        <p>{description}</p>
      </CardContent>
    </Card>
  )
}
