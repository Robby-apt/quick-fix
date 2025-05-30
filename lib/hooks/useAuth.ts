'use client';

import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from 'react';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

interface User {
	id: string;
	email: string;
	role: 'client' | 'handyman' | 'admin';
	profile: {
		id: string;
		first_name: string;
		last_name: string;
		phone?: string;
		address?: string;
		city?: string;
		zip?: string;
		bio?: string;
		profile_image?: string;
	};
	handymanProfile?: {
		service_category: string;
		experience_years: number;
		service_area: number;
		hourly_rate?: number;
		is_verified: boolean;
	};
}

interface AuthResponse {
	user: User;
	message?: string;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	registerClient: (data: any) => Promise<void>;
	registerHandyman: (data: any) => Promise<void>;
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		checkAuth();
	}, []);

	const checkAuth = async () => {
		try {
			const response = (await apiClient.getCurrentUser()) as AuthResponse;
			setUser(response.user);
		} catch (error) {
			// User not authenticated
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	const login = async (email: string, password: string) => {
		try {
			const response = (await apiClient.login(
				email,
				password
			)) as AuthResponse;
			setUser(response.user);

			// Redirect based on role
			if (response.user.role === 'admin') {
				router.push('/admin');
			} else if (response.user.role === 'handyman') {
				router.push('/dashboard/handyman');
			} else {
				router.push('/dashboard/client');
			}
		} catch (error) {
			throw error;
		}
	};

	const logout = async () => {
		try {
			await apiClient.logout();
			setUser(null);
			router.push('/');
		} catch (error) {
			console.error('Logout error:', error);
			// Force logout on client side even if API call fails
			setUser(null);
			router.push('/');
		}
	};

	const registerClient = async (data: any) => {
		try {
			const response = (await apiClient.registerClient(
				data
			)) as AuthResponse;
			setUser(response.user);
			router.push('/dashboard/client');
		} catch (error) {
			throw error;
		}
	};

	const registerHandyman = async (data: any) => {
		try {
			const response = (await apiClient.registerHandyman(
				data
			)) as AuthResponse;
			setUser(response.user);
			router.push('/dashboard/handyman');
		} catch (error) {
			throw error;
		}
	};

	const refreshUser = async () => {
		try {
			const response = (await apiClient.getCurrentUser()) as AuthResponse;
			setUser(response.user);
		} catch (error) {
			setUser(null);
		}
	};

	const contextValue: AuthContextType = {
		user,
		loading,
		login,
		logout,
		registerClient,
		registerHandyman,
		refreshUser,
	};

	return (
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
