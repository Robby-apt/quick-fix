import { Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface TestimonialCardProps {
  name: string
  role: string
  content: string
  rating: number
  image: string
}

export default function TestimonialCard({ name, role, content, rating, image }: TestimonialCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex-grow">
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
          ))}
        </div>
        <p className="italic text-muted-foreground">{content}</p>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex items-center gap-3">
          <img src={image || "/placeholder.svg"} alt={name} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
