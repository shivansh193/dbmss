import pool from './db'; // import the database connection

async function setupDatabase() {
    try {
        // Create the subdomains table if it does not exist
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS subdomains (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL
            );
        `;

        await pool.query(createTableQuery);
        console.log('Subdomains table created or already exists.');

    } catch (error) {
        console.error('Error setting up the database:', error);
    } finally {
        // Close the database connection
        await pool.end();
    }
}

// Run the setup function
setupDatabase(); 