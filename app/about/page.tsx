import { Building, Clock, Heart, Shield, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Quick Fix</h1>
          <p className="text-xl max-w-3xl mx-auto">
            We're on a mission to make home repairs and maintenance simple, reliable, and stress-free.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Quick Fix was founded in 2020 with a simple idea: connecting homeowners with skilled handymen
                  shouldn't be complicated.
                </p>
                <p>
                  After experiencing the frustration of finding reliable professionals for home repairs, our founders
                  decided to create a platform that makes the process seamless and trustworthy.
                </p>
                <p>
                  Today, Quick Fix has grown into a nationwide network of verified professionals, serving thousands of
                  satisfied customers every month.
                </p>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full z-0"></div>
                <img
                  src="/placeholder.svg?height=400&width=500"
                  alt="Team of handymen"
                  className="rounded-lg shadow-lg relative z-10"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 rounded-full z-0"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trust & Reliability</h3>
              <p className="text-muted-foreground">
                We verify all professionals on our platform to ensure you receive reliable, high-quality service.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer Satisfaction</h3>
              <p className="text-muted-foreground">
                Your satisfaction is our priority. We're committed to providing exceptional service every time.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-muted-foreground">
                We believe in building strong communities by connecting local professionals with local clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Meet Our Team</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            The passionate people behind Quick Fix who are dedicated to making home repairs simple and reliable.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Michael Johnson", role: "Founder & CEO", image: "/placeholder.svg?height=300&width=300" },
              {
                name: "Sarah Williams",
                role: "Chief Operations Officer",
                image: "/placeholder.svg?height=300&width=300",
              },
              { name: "David Thompson", role: "Head of Technology", image: "/placeholder.svg?height=300&width=300" },
            ].map((member, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-48 h-48 object-cover rounded-full mb-4"
                />
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-4">
                <Users className="h-10 w-10" />
              </div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-lg">Verified Professionals</div>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Building className="h-10 w-10" />
              </div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-lg">Cities Served</div>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Clock className="h-10 w-10" />
              </div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-lg">Customer Support</div>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Heart className="h-10 w-10" />
              </div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-lg">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
