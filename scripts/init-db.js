// CommonJS version of the initialization script
const { randomUUID } = require('crypto');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// Database connection
let db = null;

function getDatabase() {
	if (!db) {
		db = new Database('quickfix.db');
		db.pragma('journal_mode = WAL');
		db.pragma('foreign_keys = ON');
	}
	return db;
}

// Initialize database with schema
function initializeDatabase() {
	const database = getDatabase();

	try {
		// Read and execute schema
		const schemaPath = path.join(process.cwd(), 'lib/db/schema.sql');
		const schema = fs.readFileSync(schemaPath, 'utf8');
		database.exec(schema);
		console.log('✅ Database schema initialized successfully');

		// Check if admin user exists
		const adminEmail = 'admin@quickfix.com';
		const adminCheck = database
			.prepare('SELECT * FROM users WHERE email = ?')
			.get(adminEmail);

		if (!adminCheck) {
			// Create admin user
			const adminId = randomUUID();
			const passwordHash = bcrypt.hashSync('admin123', 10);

			database
				.prepare(
					`
        INSERT INTO users (id, email, password_hash, role)
        VALUES (?, ?, ?, ?)
      `
				)
				.run(adminId, adminEmail, passwordHash, 'admin');

			// Create admin profile
			const profileId = randomUUID();
			database
				.prepare(
					`
        INSERT INTO profiles (id, user_id, first_name, last_name, phone, address, city, zip, bio)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
				)
				.run(
					profileId,
					adminId,
					'Admin',
					'User',
					'+1234567890',
					'123 Admin St',
					'Admin City',
					'12345',
					'System Administrator'
				);

			console.log('✅ Admin user created successfully!');
			console.log('📧 Email: admin@quickfix.com');
			console.log('🔑 Password: admin123');
		} else {
			console.log('ℹ️ Admin user already exists');
		}

		// Insert default service categories if they don't exist
		const categoriesCount = database
			.prepare('SELECT COUNT(*) as count FROM service_categories')
			.get();

		if (categoriesCount.count === 0) {
			const categories = [
				[
					'plumbing',
					'Plumbing',
					'Professional plumbing services for all your needs',
					'wrench',
				],
				[
					'electrical',
					'Electrical',
					'Certified electricians for safe and reliable electrical work',
					'zap',
				],
				[
					'roofing',
					'Roofing',
					'Expert roofing services to protect your home',
					'home',
				],
				[
					'carpentry',
					'Carpentry',
					'Skilled carpenters for all your woodworking needs',
					'hammer',
				],
				[
					'painting',
					'Painting',
					'Professional painting services for interior and exterior',
					'paintbrush',
				],
				[
					'cleaning',
					'Cleaning',
					'Professional cleaning services for homes and offices',
					'sparkles',
				],
			];

			const insertCategory = database.prepare(`
        INSERT INTO service_categories (id, name, description, icon)
        VALUES (?, ?, ?, ?)
      `);

			categories.forEach((category) => {
				insertCategory.run(
					category[0],
					category[1],
					category[2],
					category[3]
				);
			});

			console.log('✅ Default service categories created');
		}

		console.log('✅ Database initialization complete!');
	} catch (error) {
		console.error('❌ Error initializing database:', error);
		process.exit(1);
	}
}

// Run initialization
initializeDatabase();
