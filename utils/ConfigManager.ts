export class ConfigManager {
  static getEnvVar(key: string, required = true): string {
    const value = process.env[key];
    if (!value && required) {
      throw new Error(`❌ Missing environment variable: ${key}`);
    }
    return value || "";
  }

  static username(): string {
    return this.getEnvVar("EMAIL_ADDRESS");
  }

  static password(): string {
    return this.getEnvVar("QA_PASSWORD");
  }
}
