import fs from 'fs';
import path from 'path';
import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Get DB URL from environment or hardcode
const connectionString = "postgresql://postgres.rvrzwfminoajalbulvmi:mi4AIS-axZZgdvjABRZU3Pytuae1xqFzgVxmK8CpgeI@aws-0-eu-central-1.pooler.supabase.com:6543/postgres";

async function run() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Connected to database.');
    
    const sqlPath = path.join(process.cwd(), 'supabase', 'seed_reviews.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Executing SQL...');
    await client.query(sql);
    console.log('Success! Reviews table created and seeded.');
    
  } catch (err) {
    console.error('Error executing SQL:', err);
  } finally {
    await client.end();
  }
}

run();
