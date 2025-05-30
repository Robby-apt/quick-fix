import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifySession } from '@/lib/auth/session';
import {
	getProfileByUserId,
	getBookingById,
	createReview,
} from '@/lib/db/database';

const CreateReviewSchema = z.object({
	bookingId: z.string().uuid(),
	rating: z.number().int().min(1).max(5),
	comment: z.string().min(10),
});

export async function POST(request: NextRequest) {
	try {
		const session = await verifySession();
		if (!session || session.role !== 'client') {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const body = await request.json();
		const validatedData = CreateReviewSchema.parse(body);

		const profile = await getProfileByUserId(session.userId);
		if (!profile) {
			return NextResponse.json(
				{ error: 'Profile not found' },
				{ status: 404 }
			);
		}

		const booking = await getBookingById(validatedData.bookingId);
		if (!booking) {
			return NextResponse.json(
				{ error: 'Booking not found' },
				{ status: 404 }
			);
		}

		// Check if user is the client who made the booking
		if (booking.client_id !== profile.id) {
			return NextResponse.json(
				{ error: 'You can only review your own bookings' },
				{ status: 403 }
			);
		}

		// Check if booking is completed
		if (booking.status !== 'completed') {
			return NextResponse.json(
				{ error: 'You can only review completed bookings' },
				{ status: 400 }
			);
		}

		const review = await createReview({
			booking_id: validatedData.bookingId,
			client_id: profile.id,
			handyman_id: booking.handyman_id,
			rating: validatedData.rating,
			comment: validatedData.comment,
		});

		return NextResponse.json({ success: true, review });
	} catch (error) {
		console.error('Create review error:', error);

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
