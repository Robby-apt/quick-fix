import Link from 'next/link';
import {
	ArrowRight,
	CheckCircle,
	Clock,
	MapPin,
	PenToolIcon as Tool,
	Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ServiceCard from '@/components/service-card';
import TestimonialCard from '@/components/testimonial-card';

export default function LandingPage() {
	const services = [
		{
			title: 'Plumbing',
			icon: <Wrench className="h-10 w-10 text-primary" />,
			description:
				'Fix leaks, install fixtures, and solve all your plumbing needs with our expert plumbers.',
		},
		{
			title: 'Electrical',
			icon: <Tool className="h-10 w-10 text-primary" />,
			description:
				'From rewiring to installations, our certified electricians ensure your electrical systems are safe.',
		},
		{
			title: 'Roofing',
			icon: <MapPin className="h-10 w-10 text-primary" />,
			description:
				'Repair or replace your roof with our skilled roofers who deliver quality workmanship.',
		},
	];

	const testimonials = [
		{
			name: 'Marcus Johnson',
			role: 'Homeowner',
			content:
				'Quick Fix connected me with an amazing plumber who fixed my leaking pipes in no time. Highly recommended!',
			rating: 5,
			image: '/placeholder.svg?height=80&width=80',
		},
		{
			name: 'Tasha Williams',
			role: 'Property Manager',
			content:
				'As a property manager, I rely on Quick Fix for all maintenance needs. Their professionals are reliable and skilled.',
			rating: 5,
			image: '/placeholder.svg?height=80&width=80',
		},
		{
			name: 'David Carter',
			role: 'Business Owner',
			content:
				'The electrician I hired through Quick Fix rewired my entire shop efficiently and at a reasonable price.',
			rating: 4,
			image: '/placeholder.svg?height=80&width=80',
		},
	];

	return (
		<div className="flex flex-col min-h-screen">
			{/* Hero Section */}
			<section className="bg-primary text-primary-foreground py-16 md:py-24">
				<div className="container mx-auto px-4">
					<div className="flex flex-col md:flex-row items-center gap-8">
						<div className="flex-1 space-y-6">
							<h1 className="text-4xl md:text-6xl font-bold">
								Find Skilled Handymen In Your Area
							</h1>
							<p className="text-xl md:text-2xl">
								Connect with trusted professionals for plumbing,
								electrical, roofing, and more.
							</p>
							<div className="flex flex-col sm:flex-row gap-4">
								<Button
									size="lg"
									asChild
									className="hover:bg-transparent hover:text-primary-foreground hover:border-primary-foreground hover:border"
								>
									<Link href="/register/client">
										Hire a Professional
									</Link>
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="bg-primary-foreground text-primary"
									asChild
								>
									<Link href="/register/handyman">
										Join as a Handyman
									</Link>
								</Button>
							</div>
						</div>
						<div className="flex-1 flex justify-center">
							<div className="relative w-full max-w-md">
								<div className="absolute -top-6 -left-6 w-24 h-24 bg-secondary rounded-full z-0"></div>
								<img
									src={`/images/hero-img.jpg`}
									alt="Handyman at work"
									className="rounded-lg shadow-xl relative z-10"
									style={{
										WebkitTransform: 'scaleX(-1)',
										transform: 'scaleX(-1)',
									}}
								/>
								<div className="absolute -bottom-6 -right-6 w-24 h-24 bg-secondary rounded-full z-0"></div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* How It Works */}
			<section className="py-16 bg-background">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
						How Quick Fix Works
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="flex flex-col items-center text-center p-6 rounded-lg border border-border">
							<div className="bg-primary/10 p-4 rounded-full mb-4">
								<MapPin className="h-8 w-8 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								Find Local Professionals
							</h3>
							<p className="text-muted-foreground">
								Browse through our network of verified handymen
								in your area.
							</p>
						</div>
						<div className="flex flex-col items-center text-center p-6 rounded-lg border border-border">
							<div className="bg-primary/10 p-4 rounded-full mb-4">
								<Clock className="h-8 w-8 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								Book an Appointment
							</h3>
							<p className="text-muted-foreground">
								Schedule a service at a time that works best for
								you.
							</p>
						</div>
						<div className="flex flex-col items-center text-center p-6 rounded-lg border border-border">
							<div className="bg-primary/10 p-4 rounded-full mb-4">
								<CheckCircle className="h-8 w-8 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								Get the Job Done
							</h3>
							<p className="text-muted-foreground">
								Sit back as our professionals handle your home
								repair needs.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Services */}
			<section className="py-16 bg-muted/50">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
						Our Services
					</h2>
					<p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
						Quick Fix connects you with skilled professionals for
						all your home repair and maintenance needs.
					</p>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{services.map((service, index) => (
							<ServiceCard
								key={index}
								title={service.title}
								icon={service.icon}
								description={service.description}
							/>
						))}
					</div>
					<div className="text-center mt-12">
						<Button size="lg" variant="outline" asChild>
							<Link href="/services">
								View All Services
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Testimonials */}
			<section className="py-16 bg-background">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
						What Our Customers Say
					</h2>
					<p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
						Don't just take our word for it. Here's what people are
						saying about Quick Fix.
					</p>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{testimonials.map((testimonial, index) => (
							<TestimonialCard
								key={index}
								name={testimonial.name}
								role={testimonial.role}
								content={testimonial.content}
								rating={testimonial.rating}
								image={testimonial.image}
							/>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="py-16 bg-primary text-primary-foreground">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						Ready to Get Started?
					</h2>
					<p className="text-xl mb-8 max-w-2xl mx-auto">
						Join thousands of satisfied customers who have found
						reliable handymen through Quick Fix.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button size="lg" variant="secondary" asChild>
							<Link href="/register/client">Find a Handyman</Link>
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
							asChild
						>
							<Link href="/register/handyman">
								Become a Provider
							</Link>
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
}
