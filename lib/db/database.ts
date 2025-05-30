import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import bcrypt from 'bcrypt';

sqlite3.verbose();

let db: Database<sqlite3.Database, sqlite3.Statement>;

export type User = {
	id: number;
	email: string;
	role: 'client' | 'technician' | 'admin';
	profile: {
		first_name: string;
		last_name: string;
		phone: string;
		location: string;
	};
};

export async function initDB() {
	// Close existing connection if it exists
	if (db) await db.close();

	db = await open({
		filename: './quickfix.db',
		driver: sqlite3.Database,
	});

	// Enable foreign key support
	await db.exec('PRAGMA foreign_keys = ON');

	// Drop existing tables to ensure clean slate
	await db.exec(`
    DROP TABLE IF EXISTS technician_feedback;
    DROP TABLE IF EXISTS customer_feedback;
    DROP TABLE IF EXISTS messages;
    DROP TABLE IF EXISTS ratings;
    DROP TABLE IF EXISTS bookings;
    DROP TABLE IF EXISTS technician_services;
    DROP TABLE IF EXISTS services;
    DROP TABLE IF EXISTS users;
  `);

	// Create tables with updated schema
	await db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,  -- Changed to NOT NULL
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      user_type TEXT CHECK(user_type IN ('client', 'technician', 'admin')) NOT NULL
    );

    CREATE TABLE services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT
    );

    CREATE TABLE technician_services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      technician_id INTEGER NOT NULL,
      service_id INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    );

    CREATE TABLE bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      technician_id INTEGER NOT NULL,
      service_id INTEGER NOT NULL,
      date_requested TEXT NOT NULL,
      status TEXT CHECK(status IN ('pending', 'accepted', 'completed', 'cancelled')) DEFAULT 'pending',
      FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    );

    CREATE TABLE ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL,
      rater_id INTEGER NOT NULL,
      ratee_id INTEGER NOT NULL,
      rating INTEGER CHECK(rating BETWEEN 1 AND 5),
      comment TEXT,
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
      FOREIGN KEY (rater_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (ratee_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      receiver_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      sent_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

	console.log('Database initialized with new schema');
}

export async function getDB() {
	if (!db) {
		await initDB();
	}
	return db;
}

export async function getUserByEmail(email: string): Promise<any> {
	const db = await getDB();
	const user = await db.get(
		`SELECT 
			id, 
			email, 
			user_type as role, 
			name, 
			phone, 
			location, 
			password as password_hash
		FROM users 
		WHERE email = ?`,
		email
	);
	return user ? { ...user, role: user.role } : undefined;
}

export async function getUserById(id: number | string): Promise<any> {
	const db = await getDB();
	const user = await db.get(
		`SELECT 
            id, 
            email, 
            user_type as role, 
            name, 
            phone, 
            location
        FROM users 
        WHERE id = ?`,
		id
	);
	return user ? { ...user, role: user.role } : undefined;
}

export async function createUser(
	email: string,
	password: string,
	role: 'client' | 'technician' | 'admin',
	name: string = '',
	phone: string = '',
	location: string = ''
): Promise<User> {
	const db = await getDB();
	const hashedPassword = await bcrypt.hash(password, 10);

	const result = await db.run(
		`INSERT INTO users (name, email, password, phone, location, user_type)
		 VALUES (?, ?, ?, ?, ?, ?)`,
		[name, email, hashedPassword, phone, location, role]
	);

	const id = result.lastID;
	if (typeof id !== 'number') {
		throw new Error('Failed to create user: no ID returned from database.');
	}

	return {
		id,
		email,
		role,
		profile: {
			first_name: name.split(' ')[0] || name,
			last_name: name.split(' ').slice(1).join(' ') || '',
			phone,
			location,
		},
	};
}

export async function verifyCredentials(
	email: string,
	password: string
): Promise<User | null> {
	const db = await getDB();
	const user = await db.get(
		'SELECT id, email, password, user_type as role, name, phone, location FROM users WHERE email = ?',
		email
	);

	if (!user) return null;

	const isValid = await bcrypt.compare(password, user.password);
	return isValid ? { ...user, role: user.role } : null;
}

export async function createBooking(
	clientId: number,
	technicianId: number,
	serviceId: number,
	dateRequested: string
): Promise<number> {
	const db = await getDB();
	const result = await db.run(
		`INSERT INTO bookings (client_id, technician_id, service_id, date_requested)
		 VALUES (?, ?, ?, ?)`,
		[clientId, technicianId, serviceId, dateRequested]
	);

	if (!result.lastID) {
		throw new Error('Failed to create booking');
	}

	return result.lastID;
}

export async function rateUser(
	bookingId: number,
	raterId: number,
	rateeId: number,
	rating: number,
	comment: string = ''
): Promise<void> {
	const db = await getDB();
	await db.run(
		`INSERT INTO ratings (booking_id, rater_id, ratee_id, rating, comment)
		 VALUES (?, ?, ?, ?, ?)`,
		[bookingId, raterId, rateeId, rating, comment]
	);
}

export async function searchServices(query: string = '', handymanId?: number) {
	const db = await getDB();
	let sql = `
        SELECT s.*, u.id as handyman_id, u.name as handyman_name
        FROM services s
        LEFT JOIN technician_services ts ON s.id = ts.service_id
        LEFT JOIN users u ON ts.technician_id = u.id
    `;
	const params: any[] = [];

	if (query) {
		sql += ' WHERE s.name LIKE ?';
		params.push(`%${query}%`);
	}
	if (handymanId) {
		sql += query ? ' AND' : ' WHERE';
		sql += ' u.id = ?';
		params.push(handymanId);
	}

	const services = await db.all(sql, params);
	return services;
}

export async function getProfileByUserId(userId: string | number) {
	const db = await getDB();
	const user = await db.get(
		`SELECT id, name, phone, location FROM users WHERE id = ?`,
		[userId]
	);
	if (!user) return null;
	const [first_name, ...rest] = user.name.split(' ');
	return {
		id: user.id,
		first_name,
		last_name: rest.join(' '),
		phone: user.phone,
		location: user.location,
	};
}

export async function createService(service: {
	title: string;
	description: string;
	category: string;
	price_type: string;
	base_price: number;
	handyman_id: number;
}) {
	const db = await getDB();
	const result = await db.run(
		`INSERT INTO services (title, description, category, price_type, base_price, handyman_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
		[
			service.title,
			service.description,
			service.category,
			service.price_type,
			service.base_price,
			service.handyman_id,
		]
	);
	return { id: result.lastID, ...service };
}

export async function verifyPassword(password: string, hash: string) {
	return await bcrypt.compare(password, hash);
}

export async function getHandymanProfileById(id: number | string) {
	const db = await getDB();
	const handyman = await db.get(
		`SELECT id, name, phone, location FROM users WHERE id = ? AND user_type = 'technician'`,
		id
	);
	if (!handyman) return null;
	const [first_name, ...rest] = handyman.name.split(' ');
	return {
		id: handyman.id,
		first_name,
		last_name: rest.join(' '),
		phone: handyman.phone,
		location: handyman.location,
	};
}

export async function createProfile({
	user_id,
	first_name,
	last_name,
	phone,
	address,
	city,
	zip,
	bio,
}: {
	user_id: number;
	first_name: string;
	last_name: string;
	phone: string;
	address: string;
	city: string;
	zip: string;
	bio: string;
}) {
	const db = await getDB();
	const result = await db.run(
		`INSERT INTO profiles (user_id, first_name, last_name, phone, address, city, zip, bio)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
		[user_id, first_name, last_name, phone, address, city, zip, bio]
	);
	return {
		id: result.lastID,
		user_id,
		first_name,
		last_name,
		phone,
		address,
		city,
		zip,
		bio,
	};
}

export async function createHandymanProfile({
	id,
	service_category,
	experience_years,
	service_area,
	is_verified,
}: {
	id: number;
	service_category: string;
	experience_years: number;
	service_area: number;
	is_verified: boolean;
}) {
	const db = await getDB();
	const result = await db.run(
		`INSERT INTO handyman_profiles (profile_id, service_category, experience_years, service_area, is_verified)
         VALUES (?, ?, ?, ?, ?)`,
		[
			id,
			service_category,
			experience_years,
			service_area,
			is_verified ? 1 : 0,
		]
	);
	return {
		id: result.lastID,
		profile_id: id,
		service_category,
		experience_years,
		service_area,
		is_verified,
	};
}

export async function getBookingById(id: number | string) {
	const db = await getDB();
	return await db.get(`SELECT * FROM bookings WHERE id = ?`, id);
}

export async function updateBookingStatus(id: number | string, status: string) {
	const db = await getDB();
	await db.run(`UPDATE bookings SET status = ? WHERE id = ?`, [status, id]);
}

export async function createMessage({
	sender_id,
	receiver_id,
	booking_id,
	content,
}: {
	sender_id: number;
	receiver_id: number;
	booking_id?: string | null;
	content: string;
}) {
	const db = await getDB();
	const result = await db.run(
		`INSERT INTO messages (sender_id, receiver_id, booking_id, content, created_at)
         VALUES (?, ?, ?, ?, datetime('now'))`,
		[sender_id, receiver_id, booking_id ?? null, content]
	);
	return {
		id: result.lastID,
		sender_id,
		receiver_id,
		booking_id,
		content,
		created_at: new Date().toISOString(),
	};
}

export async function getConversationMessages(
	profileId: number,
	otherPartyId: number | string
) {
	const db = await getDB();
	return await db.all(
		`SELECT * FROM messages
         WHERE (sender_id = ? AND receiver_id = ?)
            OR (sender_id = ? AND receiver_id = ?)
         ORDER BY created_at ASC`,
		[profileId, otherPartyId, otherPartyId, profileId]
	);
}

export async function getUserConversations(profileId: number) {
	const db = await getDB();
	return await db.all(
		`SELECT
            m.*,
            u1.name as sender_name,
            u2.name as receiver_name
        FROM messages m
        LEFT JOIN users u1 ON m.sender_id = u1.id
        LEFT JOIN users u2 ON m.receiver_id = u2.id
        WHERE m.sender_id = ? OR m.receiver_id = ?
        GROUP BY m.receiver_id, m.sender_id
        ORDER BY m.created_at DESC`,
		[profileId, profileId]
	);
}

export async function createReview({
	booking_id,
	client_id,
	handyman_id,
	rating,
	comment,
}: {
	booking_id: string;
	client_id: number;
	handyman_id: number;
	rating: number;
	comment: string;
}) {
	const db = await getDB();
	const result = await db.run(
		`INSERT INTO reviews (booking_id, client_id, handyman_id, rating, comment, created_at)
         VALUES (?, ?, ?, ?, ?, datetime('now'))`,
		[booking_id, client_id, handyman_id, rating, comment]
	);
	return {
		id: result.lastID,
		booking_id,
		client_id,
		handyman_id,
		rating,
		comment,
		created_at: new Date().toISOString(),
	};
}

// Add this to ensure proper cleanup
process.on('exit', async () => {
	if (db) {
		await db.close();
	}
});
