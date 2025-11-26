import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    companyName: string;
    taxId: string;
    swiftCode?: string;
    accountName?: string;
    accountNumber?: string;
}

const registeredUsersFile = path.resolve(process.cwd(), "test-data/registeredUsers.json");

/** Read all registered users */
export function getRegisteredUsers(): UserData[] {
    if (!fs.existsSync(registeredUsersFile)) return [];

    try {
        const content = fs.readFileSync(registeredUsersFile, "utf8").trim();
        return content ? JSON.parse(content) : [];
    } catch {
        return [];
    }
}

/** Generate a new fake user */
export function generateFakeUser(): UserData {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
        firstName,
        lastName,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        phone: faker.phone.number({ style: "national" }),
        password: faker.internet.password({ length: 12 }) + "@2025",
        companyName: faker.company.name(),
        taxId: faker.number.int({ min: 1000000000, max: 9999999999 }).toString(),
        accountName: `${firstName} ${lastName}`,
        accountNumber: faker.finance.accountNumber(10),
        swiftCode: faker.string.alphanumeric({ length: 8, casing: "upper" }),
    };
}

/** Save user in a concurrency-safe way */
export function saveRegisteredUser(user: UserData): void {
    let users = getRegisteredUsers();

    users.push(user);

    fs.mkdirSync(path.dirname(registeredUsersFile), { recursive: true });

    // atomic write
    const tempFile = `${registeredUsersFile}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(users, null, 2));
    fs.renameSync(tempFile, registeredUsersFile);
}

/** Return an existing user if present else generate new (not saved) */
export function getOrCreateTestUser(): UserData {
    const users = getRegisteredUsers();

    if (users.length > 0) {
        console.log(`✅ Reusing existing user: ${users[0].email}`);
        return users[0];
    }

    const newUser = generateFakeUser();
    console.log(`🆕 Generated new user (in-memory): ${newUser.email}`);

    return newUser;
}
