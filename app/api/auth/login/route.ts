import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
	getUserByEmail,
	verifyPassword,
	getProfileByUserId,
} from '@/lib/db/database';
import { createSession } from '@/lib/auth/session';

const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { email, password } = LoginSchema.parse(body);

		// Find user
		const user = await getUserByEmail(email);
		if (!user) {
			return NextResponse.json(
				{ error: 'Invalid email or password' },
				{ status: 401 }
			);
		}

		// Verify password
		const isValidPassword = await verifyPassword(
			password,
			user.password_hash
		);
		if (!isValidPassword) {
			return NextResponse.json(
				{ error: 'Invalid email or password' },
				{ status: 401 }
			);
		}

		// Get profile
		const profile = await getProfileByUserId(user.id);
		if (!profile) {
			return NextResponse.json(
				{ error: 'Profile not found' },
				{ status: 404 }
			);
		}

		// Create session
		await createSession(user.id, user.email, user.role);

		return NextResponse.json({
			success: true,
			user: {
				id: user.id,
				email: user.email,
				role: user.role,
				profile: profile,
			},
		});
	} catch (error) {
		console.error('Login error:', error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: 'Invalid input data' },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
