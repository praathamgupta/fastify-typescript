import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});
async function executeQuery(queryText: string, queryValues?: any[]): Promise<QueryResult> {
    const client = await pool.connect();
    try
    {
        const result = await client.query(queryText, queryValues);
        return result;
    } finally {
        client.release();
    }
}

export { executeQuery };
