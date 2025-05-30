import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifySession } from '@/lib/auth/session';
import {
	getProfileByUserId,
	createService,
	searchServices,
} from '@/lib/db/database';

const CreateServiceSchema = z.object({
	title: z.string().min(5),
	description: z.string().min(20),
	category: z.string().min(1),
	priceType: z.enum(['hourly', 'fixed']),
	basePrice: z.number().positive(),
});

export async function POST(request: NextRequest) {
	try {
		const session = await verifySession();
		if (!session || session.role !== 'handyman') {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const body = await request.json();
		const validatedData = CreateServiceSchema.parse(body);

		const profile = await getProfileByUserId(session.userId);
		if (!profile) {
			return NextResponse.json(
				{ error: 'Profile not found' },
				{ status: 404 }
			);
		}

		const service = await createService({
			title: validatedData.title,
			description: validatedData.description,
			category: validatedData.category,
			price_type: validatedData.priceType,
			base_price: validatedData.basePrice,
			handyman_id: profile.id,
		});

		return NextResponse.json({ success: true, service });
	} catch (error) {
		console.error('Create service error:', error);

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

export async function GET(req: Request) {
	try {
		let services;
		const url = new URL(req.url);
		const query = url.searchParams.get('query') || '';
		const handymanId = url.searchParams.get('handymanId')
			? Number(url.searchParams.get('handymanId'))
			: undefined;

		if (query || handymanId) {
			services = await searchServices(query, handymanId);
		} else {
			services = await searchServices();
		}

		return NextResponse.json({ services });
	} catch (error) {
		console.error('Get services error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
