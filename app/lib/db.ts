import { Pool } from 'pg';

// Use your provided connection string with environment variables
const connectionString = `postgresql://postgres.sivegmfsjudlastckfnk:${process.env.SUPABASE_PASSWORD}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;

const pool = new Pool({
    connectionString,
});

export default pool; 