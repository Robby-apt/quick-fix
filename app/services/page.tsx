import Link from "next/link"
import {
  ArrowRight,
  CheckCircle,
  Clock,
  MessageSquare,
  Star,
  Wrench,
  PenToolIcon as Tool,
  MapPin,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ServicesPage() {
  const serviceCategories = [
    {
      title: "Plumbing",
      icon: <Wrench className="h-12 w-12 text-primary" />,
      description: "Professional plumbing services for all your needs",
      services: [
        "Leak Detection & Repair",
        "Pipe Installation & Replacement",
        "Drain Cleaning",
        "Fixture Installation",
        "Water Heater Services",
        "Sewer Line Repair",
      ],
    },
    {
      title: "Electrical",
      icon: <Tool className="h-12 w-12 text-primary" />,
      description: "Certified electricians for safe and reliable electrical work",
      services: [
        "Wiring & Rewiring",
        "Electrical Panel Upgrades",
        "Lighting Installation",
        "Outlet & Switch Repair",
        "Ceiling Fan Installation",
        "Electrical Safety Inspections",
      ],
    },
    {
      title: "Roofing",
      icon: <MapPin className="h-12 w-12 text-primary" />,
      description: "Expert roofing services to protect your home",
      services: [
        "Roof Repair & Replacement",
        "Leak Detection & Repair",
        "Shingle Replacement",
        "Gutter Installation & Cleaning",
        "Roof Inspection",
        "Storm Damage Repair",
      ],
    },
    {
      title: "Carpentry",
      icon: <Tool className="h-12 w-12 text-primary" />,
      description: "Skilled carpenters for all your woodworking needs",
      services: [
        "Custom Cabinetry",
        "Furniture Repair",
        "Deck Building & Repair",
        "Door Installation & Repair",
        "Trim & Molding Installation",
        "Framing & Structural Repairs",
      ],
    },
    {
      title: "Painting",
      icon: <Tool className="h-12 w-12 text-primary" />,
      description: "Professional painting services for interior and exterior",
      services: [
        "Interior Painting",
        "Exterior Painting",
        "Cabinet Refinishing",
        "Deck & Fence Staining",
        "Wallpaper Removal & Installation",
        "Color Consultation",
      ],
    },
    {
      title: "Cleaning",
      icon: <Tool className="h-12 w-12 text-primary" />,
      description: "Professional cleaning services for homes and offices",
      services: [
        "Deep Cleaning",
        "Regular Housekeeping",
        "Move-in/Move-out Cleaning",
        "Carpet & Upholstery Cleaning",
        "Window Cleaning",
        "Post-Construction Cleanup",
      ],
    },
  ]

  const featuredProviders = [
    {
      name: "Michael Smith",
      service: "Plumbing",
      rating: 4.9,
      reviews: 124,
      image: "/placeholder.svg?height=300&width=300",
      description:
        "Experienced plumber with over 15 years in the industry. Specializes in leak detection and pipe repairs.",
    },
    {
      name: "David Johnson",
      service: "Electrical",
      rating: 4.8,
      reviews: 98,
      image: "/placeholder.svg?height=300&width=300",
      description: "Licensed electrician with expertise in residential and commercial electrical systems.",
    },
    {
      name: "Robert Williams",
      service: "Roofing",
      rating: 4.9,
      reviews: 87,
      image: "/placeholder.svg?height=300&width=300",
      description: "Professional roofer specializing in roof repairs, replacements, and storm damage assessment.",
    },
    {
      name: "James Anderson",
      service: "Carpentry",
      rating: 4.7,
      reviews: 76,
      image: "/placeholder.svg?height=300&width=300",
      description: "Skilled carpenter with a passion for custom woodworking and furniture restoration.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Find skilled professionals for all your home repair and maintenance needs
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Services</h3>
              <p className="text-muted-foreground">
                Explore our wide range of professional services and find what you need.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Book an Appointment</h3>
              <p className="text-muted-foreground">Select a service provider and schedule a time that works for you.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get the Job Done</h3>
              <p className="text-muted-foreground">
                Our professionals will arrive on time and complete the work to your satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Service Categories</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Browse our comprehensive range of home services provided by verified professionals
          </p>

          <Tabs defaultValue="all" className="w-full mb-8">
            <TabsList className="flex flex-wrap justify-center mb-8">
              <TabsTrigger value="all">All Services</TabsTrigger>
              <TabsTrigger value="plumbing">Plumbing</TabsTrigger>
              <TabsTrigger value="electrical">Electrical</TabsTrigger>
              <TabsTrigger value="roofing">Roofing</TabsTrigger>
              <TabsTrigger value="carpentry">Carpentry</TabsTrigger>
              <TabsTrigger value="painting">Painting</TabsTrigger>
              <TabsTrigger value="cleaning">Cleaning</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {serviceCategories.map((category, index) => (
                  <Card key={index} className="h-full flex flex-col">
                    <CardHeader className="flex flex-col items-center text-center pb-2">
                      <div className="bg-primary/10 p-4 rounded-full mb-4">{category.icon}</div>
                      <CardTitle>{category.title}</CardTitle>
                      <CardDescription className="mt-2">{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <ul className="space-y-2">
                        {category.services.map((service, serviceIndex) => (
                          <li key={serviceIndex} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                            <span>{service}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" asChild>
                        <Link href={`/services/${category.title.toLowerCase()}`}>
                          View {category.title} Services
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {serviceCategories.map((category) => (
              <TabsContent key={category.title.toLowerCase()} value={category.title.toLowerCase()}>
                <Card className="mb-8">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/10 p-4 rounded-full">{category.icon}</div>
                    <div>
                      <CardTitle>{category.title}</CardTitle>
                      <CardDescription className="mt-2">{category.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.services.map((service, serviceIndex) => (
                        <div key={serviceIndex} className="flex items-start p-4 border rounded-lg">
                          <CheckCircle className="h-5 w-5 text-primary mr-3 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium">{service}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Professional {category.title.toLowerCase()} services by verified experts
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full md:w-auto" asChild>
                      <Link href="/register/client">Book a {category.title} Service</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Featured Providers */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Featured Service Providers</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Meet some of our top-rated professionals ready to help with your home projects
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProviders.map((provider, index) => (
              <Card key={index} className="h-full flex flex-col">
                <div className="relative">
                  <img
                    src={provider.image || "/placeholder.svg"}
                    alt={provider.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center text-white">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="font-medium">{provider.rating}</span>
                      <span className="text-sm ml-1">({provider.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <CardContent className="flex-grow pt-4">
                  <h3 className="font-semibold text-lg">{provider.name}</h3>
                  <p className="text-primary font-medium text-sm mb-2">{provider.service} Specialist</p>
                  <p className="text-muted-foreground text-sm">{provider.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                  <Button size="sm">Book Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/register/client">
                Find More Professionals
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Quick Fix</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-foreground/10 p-4 rounded-full mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Professionals</h3>
              <p className="opacity-90">
                All service providers undergo thorough background checks and skill verification before joining our
                platform.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-foreground/10 p-4 rounded-full mb-4">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p className="opacity-90">
                We stand behind the quality of our service providers' work with our satisfaction guarantee.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-foreground/10 p-4 rounded-full mb-4">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="opacity-90">
                Our customer support team is available around the clock to assist with any questions or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-muted rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to get started?</h2>
              <p className="text-muted-foreground max-w-md">
                Join thousands of satisfied customers who have found reliable handymen through Quick Fix.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/register/client">Hire a Professional</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register/handyman">Become a Provider</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
