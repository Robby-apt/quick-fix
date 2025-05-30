import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserByEmail, createUser } from '@/lib/db/database';
import { createSession } from '@/lib/auth/session';

const ClientSignupSchema = z.object({
	firstName: z.string().min(2),
	lastName: z.string().min(2),
	email: z.string().email(),
	phone: z.string().min(10),
	address: z.string().min(5),
	city: z.string().min(2),
	zip: z.string().min(5),
	password: z.string().min(8),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const validatedData = ClientSignupSchema.parse(body);

		// Check if user already exists
		const existingUser = await getUserByEmail(validatedData.email);
		if (existingUser) {
			return NextResponse.json(
				{ error: 'User with this email already exists' },
				{ status: 400 }
			);
		}

		// Create user with full name, phone, and full address as 'location'
		const user = await createUser(
			validatedData.email,
			validatedData.password,
			'client',
			`${validatedData.firstName} ${validatedData.lastName}`,
			validatedData.phone,
			`${validatedData.address}, ${validatedData.city}, ${validatedData.zip}`
		);

		// Create session
		await createSession(
			user.id.toString(),
			user.email,
			user.role as 'client' | 'admin' | 'handyman'
		);

		return NextResponse.json({
			success: true,
			user: {
				id: user.id,
				email: user.email,
				role: user.role,
				profile: user.profile, // profile is always present and well-formed
			},
		});
	} catch (error) {
		console.error('Client registration error:', error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: 'Invalid input data', details: error.errors },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
