import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
}

const registeredUsersFile = path.resolve(process.cwd(), "test-data/registeredUsers.json");

/** Read all registered users from file (no write) */
export function getRegisteredUsers(): UserData[] {
    if (!fs.existsSync(registeredUsersFile)) return [];
    try {
        const content = fs.readFileSync(registeredUsersFile, "utf-8").trim();
        return content ? JSON.parse(content) : [];
    } catch {
        return [];
    }
}

/** Generate a new fake user in memory */
export function generateFakeUser(): UserData {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    const phone = faker.phone.number({ style: "national" });
    const password = faker.internet.password({ length: 12 }) + "@2025";

    return { firstName, lastName, email, phone, password };
}

/** Save a user explicitly to JSON file (optional) */
export function saveRegisteredUser(user: UserData): void {
    let users: UserData[] = [];
    if (fs.existsSync(registeredUsersFile)) {
        try {
            const content = fs.readFileSync(registeredUsersFile, "utf-8").trim();
            users = content ? JSON.parse(content) : [];
        } catch {
            users = [];
        }
    } else {
        fs.mkdirSync(path.dirname(registeredUsersFile), { recursive: true });
    }

    users.push(user);
    fs.writeFileSync(registeredUsersFile, JSON.stringify(users, null, 2), "utf-8");
}

/** Get the first registered user if exists; else return a new in-memory user (does NOT write) */
export function getOrCreateTestUser(): UserData {
    const users = getRegisteredUsers();
    if (users.length > 0) {
        console.log(`✅ Reusing existing user: ${users[0].email}`);
        return users[0];
    }

    const newUser = generateFakeUser();
    console.log(`🆕 Generated new user (in-memory, not saved): ${newUser.email}`);
    return newUser;
}
