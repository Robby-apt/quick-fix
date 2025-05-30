'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

interface Service {
	id: string;
	title: string;
	description: string;
	category: string;
	price_type: 'hourly' | 'fixed';
	base_price: number;
	handyman_id: string;
	first_name?: string;
	last_name?: string;
	profile_image?: string;
	experience_years?: number;
	is_verified?: boolean;
}

interface ApiResponse<T> {
	data?: T;
	error?: string;
	message?: string;
}

interface ServicesResponse {
	services: Service[];
}

interface CreateServiceParams {
	title: string;
	description: string;
	category: string;
	priceType: 'hourly' | 'fixed';
	basePrice: number;
}

export function useServices(params?: {
	category?: string;
	q?: string;
	handyman?: string;
}) {
	const [services, setServices] = useState<Service[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchServices();
	}, [params?.category, params?.q, params?.handyman]);

	const fetchServices = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = (await apiClient.getServices(
				params
			)) as ApiResponse<ServicesResponse>;

			if (response.error) {
				throw new Error(response.error);
			}

			if (!response.data?.services) {
				throw new Error('Invalid services data format');
			}

			setServices(response.data.services);
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Failed to fetch services';
			setError(errorMessage);
			console.error('Error fetching services:', error);
		} finally {
			setLoading(false);
		}
	};

	const createService = async (
		data: CreateServiceParams
	): Promise<ApiResponse<Service>> => {
		try {
			const response = (await apiClient.createService(
				data
			)) as ApiResponse<Service>;

			if (response.error) {
				throw new Error(response.error);
			}

			await fetchServices(); // Refresh the list
			return response;
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Failed to create service';
			console.error('Error creating service:', error);
			throw new Error(errorMessage);
		}
	};

	return {
		services,
		loading,
		error,
		createService,
		refetch: fetchServices,
	};
}
