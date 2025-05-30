import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
// import { db } from "@/lib/db/database"
import { createSession } from '@/lib/auth/session';
import {
	getUserByEmail,
	createUser,
	createProfile,
	createHandymanProfile,
} from '@/lib/db/database';

const HandymanSignupSchema = z.object({
	firstName: z.string().min(2),
	lastName: z.string().min(2),
	email: z.string().email(),
	phone: z.string().min(10),
	address: z.string().min(5),
	city: z.string().min(2),
	zip: z.string().min(5),
	serviceCategory: z.string().min(1),
	experience: z.string().min(1),
	serviceArea: z.string().min(1),
	bio: z.string().min(20),
	password: z.string().min(8),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const validatedData = HandymanSignupSchema.parse(body);

		// Check if user already exists
		const existingUser = await getUserByEmail(validatedData.email);
		if (existingUser) {
			return NextResponse.json(
				{ error: 'User with this email already exists' },
				{ status: 400 }
			);
		}

		// Create user
		const user = await createUser(
			validatedData.email,
			validatedData.password,
			'technician' // <-- use 'technician' instead of 'handyman'
		);

		// Create profile
		const profile = await createProfile({
			user_id: user.id,
			first_name: validatedData.firstName,
			last_name: validatedData.lastName,
			phone: validatedData.phone,
			address: validatedData.address,
			city: validatedData.city,
			zip: validatedData.zip,
			bio: validatedData.bio,
		});

		if (typeof profile.id !== 'number') {
			throw new Error('Profile ID is missing after profile creation.');
		}

		// Create handyman profile
		const handymanProfile = await createHandymanProfile({
			id: profile.id,
			service_category: validatedData.serviceCategory,
			experience_years: Number.parseInt(validatedData.experience),
			service_area: Number.parseInt(validatedData.serviceArea),
			is_verified: false,
		});

		// Create session
		await createSession(
			user.id.toString(),
			user.email,
			user.role === 'technician' ? 'handyman' : user.role
		);

		return NextResponse.json({
			success: true,
			user: {
				id: user.id,
				email: user.email,
				role: user.role,
				profile: profile,
				handymanProfile: handymanProfile,
			},
		});
	} catch (error) {
		console.error('Handyman registration error:', error);

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
