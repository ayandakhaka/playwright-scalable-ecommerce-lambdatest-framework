import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export class Database {
  private static pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
});
    static async createUser(
        firstName: string, 
        lastName: string, 
        email: string, 
        phone: string, 
        password: string
    ) {
        const result = await this.pool.query(
            `INSERT INTO users (first_name, last_name, email, phone, password) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [firstName, lastName, email, phone, password]
        );
        
        return result.rows[0];
    }

    static async getUsers() {
        const result = await this.pool.query('SELECT * FROM users');
        console.log("Database results" + result.rows[0]);
        return result.rows;
    }
}



// export const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: Number(process.env.DB_PORT),
// });

// export const createUser = async (
//   firstName: string,
//   lastName: string,
//   email: string,
//   phone: string,
//   password: string
// ): Promise<User> => {
//   const result = await pool.query<User>(
//     `INSERT INTO users (first_name, last_name, email, phone, password) 
//      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
//     [firstName, lastName, email, phone, password]
//   );
//   console.log("Database results" + result.rows[0]);
//   return result.rows[0];
// };

// export const getUserByEmail = async (email: string): Promise<User | null> => {
//   const result = await pool.query<User>('SELECT * FROM users WHERE email = $1', [email]);
//   return result.rows[0] || null;
// };

// export const getPasswordByEmail = async (email: string): Promise<string | null> => {
//   const result = await pool.query<{ password: string }>(
//     'SELECT password FROM users WHERE email = $1',
//     [email]
//   );
//   return result.rows[0]?.password || null;
// };
