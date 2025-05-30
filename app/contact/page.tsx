import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto">Have questions or need assistance? We're here to help.</p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>

              <Card>
                <CardContent className="flex items-start gap-4 p-6">
                  <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Our Location</h3>
                    <p className="text-muted-foreground">
                      123 Main Street
                      <br />
                      New York, NY 10001
                      <br />
                      United States
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-start gap-4 p-6">
                  <Mail className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email Us</h3>
                    <p className="text-muted-foreground">
                      info@quickfix.com
                      <br />
                      support@quickfix.com
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-start gap-4 p-6">
                  <Phone className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Call Us</h3>
                    <p className="text-muted-foreground">
                      +1 (123) 456-7890
                      <br />
                      Monday - Friday, 9am - 6pm
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="john@example.com" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="How can we help you?" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Please describe your question or issue in detail..."
                        rows={6}
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full md:w-auto">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Find Us On The Map</h2>
          <div className="h-96 bg-muted border rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Interactive map would be displayed here</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: "How do I book a service?",
                answer:
                  "You can book a service by creating an account, browsing available professionals, and selecting a time slot that works for you.",
              },
              {
                question: "Are your professionals verified?",
                answer:
                  "Yes, all professionals on our platform undergo a thorough verification process including background checks and skill assessments.",
              },
              {
                question: "What if I'm not satisfied with the service?",
                answer:
                  "We have a satisfaction guarantee. If you're not happy with the service, please contact our support team within 48 hours and we'll work to resolve the issue.",
              },
              {
                question: "How do I become a service provider?",
                answer:
                  "To join as a service provider, register on our platform, complete the verification process, and set up your profile with your skills and availability.",
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
