'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

interface Booking {
	id: string;
	client_id: string;
	handyman_id: string;
	service_id: string;
	status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
	date: string;
	time_slot: string;
	address: string;
	city: string;
	zip: string;
	notes?: string;
	price: number;
	service_title?: string;
	service_description?: string;
	service_category?: string;
	client_first_name?: string;
	client_last_name?: string;
	client_image?: string;
	handyman_first_name?: string;
	handyman_last_name?: string;
	handyman_image?: string;
}

interface ApiResponse<T> {
	data?: T;
	error?: string;
	message?: string;
}

interface BookingsResponse {
	bookings: Booking[];
}

interface CreateBookingParams {
	serviceId: string;
	date: string;
	timeSlot: string;
	address: string;
	city: string;
	zip: string;
	notes?: string;
}

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export function useBookings() {
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchBookings();
	}, []);

	const fetchBookings = async () => {
		try {
			setLoading(true);
			setError(null);
			const response =
				(await apiClient.getBookings()) as ApiResponse<BookingsResponse>;

			if (response.error) {
				throw new Error(response.error);
			}

			if (!response.data?.bookings) {
				throw new Error('Invalid bookings data format');
			}

			setBookings(response.data.bookings);
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Failed to fetch bookings';
			setError(errorMessage);
			console.error('Error fetching bookings:', error);
		} finally {
			setLoading(false);
		}
	};

	const createBooking = async (
		data: CreateBookingParams
	): Promise<ApiResponse<Booking>> => {
		try {
			const response = (await apiClient.createBooking(
				data
			)) as ApiResponse<Booking>;

			if (response.error) {
				throw new Error(response.error);
			}

			await fetchBookings(); // Refresh the list
			return response;
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Failed to create booking';
			console.error('Error creating booking:', error);
			throw new Error(errorMessage);
		}
	};

	const updateBookingStatus = async (
		bookingId: string,
		status: BookingStatus
	): Promise<void> => {
		try {
			const response = (await apiClient.updateBookingStatus(
				bookingId,
				status
			)) as ApiResponse<void>;

			if (response.error) {
				throw new Error(response.error);
			}

			await fetchBookings(); // Refresh the list
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Failed to update booking status';
			console.error('Error updating booking status:', error);
			throw new Error(errorMessage);
		}
	};

	return {
		bookings,
		loading,
		error,
		createBooking,
		updateBookingStatus,
		refetch: fetchBookings,
	};
}
