import * as dotenv from "dotenv";
import * as path from "path";

const envName = process.env.ENV || "qa"; // default to "qa"
const envPath = path.resolve(__dirname, `envs/env.${envName}`);

const result = dotenv.config({ path: envPath });

if (result.error) {
  throw result.error;
}

console.log(`✅ Loaded environment file: ${envPath}`);
console.log("BASE_URL:", process.env.BASE_URL);
