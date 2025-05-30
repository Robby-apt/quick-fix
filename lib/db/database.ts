// database.ts

import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import bcrypt from 'bcrypt';

sqlite3.verbose();

let db: Database<sqlite3.Database, sqlite3.Statement>;

export type User = {
	id: number;
	email: string;
	role: string;
	name: string;
	phone: string;
	location: string;
};

export async function initDB() {
	db = await open({
		filename: './quickfix.db',
		driver: sqlite3.Database,
	});

	await db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      location TEXT,
      user_type TEXT CHECK(user_type IN ('client', 'technician', 'admin')) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS technician_services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      technician_id INTEGER NOT NULL,
      service_id INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bookings (
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

    CREATE TABLE IF NOT EXISTS ratings (
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

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      receiver_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      sent_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS technician_feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      technician_id INTEGER NOT NULL,
      customer_id INTEGER NOT NULL,
      rating INTEGER CHECK(rating BETWEEN 1 AND 5),
      comment TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS customer_feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      technician_id INTEGER NOT NULL,
      rating INTEGER CHECK(rating BETWEEN 1 AND 5),
      comment TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
}

export async function getDB() {
	if (!db) await initDB();
	return db;
}

export async function getUserByEmail(email: string) {
	const db = await getDB();
	return db.get('SELECT * FROM users WHERE email = ?', email);
}

export async function createUser(
	email: string,
	password: string,
	role: 'client' | 'technician' | 'admin',
	name: string,
	phone: string,
	location: string
): Promise<User> {
	const db = await getDB();
	const hashedPassword = await bcrypt.hash(password, 10);

	const result = await db.run(
		`
      INSERT INTO users (name, email, password, phone, location, user_type)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
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
		name,
		phone,
		location,
	};
}

export async function createBooking(
	clientId: number,
	technicianId: number,
	serviceId: number,
	dateRequested: string
) {
	const db = await getDB();
	await db.run(
		`
    INSERT INTO bookings (client_id, technician_id, service_id, date_requested)
    VALUES (?, ?, ?, ?)
  `,
		[clientId, technicianId, serviceId, dateRequested]
	);
}

export async function rateUser(
	bookingId: number,
	raterId: number,
	rateeId: number,
	rating: number,
	comment: string
) {
	const db = await getDB();
	await db.run(
		`
    INSERT INTO ratings (booking_id, rater_id, ratee_id, rating, comment)
    VALUES (?, ?, ?, ?, ?)
  `,
		[bookingId, raterId, rateeId, rating, comment]
	);
}
