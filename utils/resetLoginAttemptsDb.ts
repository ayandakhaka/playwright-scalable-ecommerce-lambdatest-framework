import { Client } from "pg";

async function resetLoginAttemptsDb(email: string) {
  const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  await client.connect();
  await client.query("UPDATE users SET login_attempts=0, locked_until=NULL WHERE email=$1", [email]);
  await client.end();

  console.log(`✅ Account reset for ${email}`);
}
