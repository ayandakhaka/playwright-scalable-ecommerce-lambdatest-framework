import * as dotenv from "dotenv";
import * as path from "path";

// Pick env file dynamically
const envFile = process.env.ENV_FILE || ".env";
const envPath = path.resolve(process.cwd(), envFile);
console.log(`Loading env file from path: ${envPath}`);

const result = dotenv.config({ path: envPath, override: true });

if (result.error) {
  console.error(`❌ Could not load env file at ${envPath}`);
} else {
  console.log(`✅ Loaded env vars from: ${envPath}`);
  console.log("Injected keys:", Object.keys(result.parsed || {}));
}

export class ConfigManager {
  static getEnvVar(key: string, required = true): string {
    const value = process.env[key];
    if (!value && required) {
      throw new Error(`❌ Missing environment variable: ${key}`);
    }
    return (value ?? "").trim();
  }

  static url(): string {
    return this.getEnvVar("BASE_URL");
  }

  static username(): string {
    return this.getEnvVar("EMAIL_ADDRESS");
  }

  static password(): string {
    return this.getEnvVar("QA_PASSWORD");
  }
}
