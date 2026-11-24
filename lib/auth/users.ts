import "server-only";
import { scrypt as scryptCb, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { Role } from "./session";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number, opts: { N: number; r: number; p: number }) => Promise<Buffer>;

export type AdminUser = { email: string; name: string; role: Role; passwordHash: string };

/**
 * Users come from the environment so no credentials live in the repository:
 *   ADMIN_USERS='[{"email":"a@b.com","name":"Ayesha","role":"admin","passwordHash":"scrypt$..."}]'
 * or the single-user shorthand ADMIN_EMAIL + ADMIN_PASSWORD_HASH (+ ADMIN_NAME).
 * Generate hashes with: npm run admin:hash -- "your password"
 */
export function getAdminUsers(): AdminUser[] {
  const users: AdminUser[] = [];
  if (process.env.ADMIN_USERS) {
    try {
      const parsed = JSON.parse(process.env.ADMIN_USERS) as Partial<AdminUser>[];
      for (const u of parsed) {
        if (u.email && u.passwordHash) {
          users.push({ email: u.email.toLowerCase(), name: u.name || u.email, role: u.role === "editor" ? "editor" : "admin", passwordHash: u.passwordHash });
        }
      }
    } catch {
      console.error("[auth] ADMIN_USERS is not valid JSON");
    }
  }
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH) {
    users.push({ email: process.env.ADMIN_EMAIL.toLowerCase(), name: process.env.ADMIN_NAME || "Administrator", role: "admin", passwordHash: process.env.ADMIN_PASSWORD_HASH });
  }
  return users;
}

const PARAMS = { N: 16384, r: 8, p: 1 };

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await scrypt(password.normalize("NFKC"), salt, 64, PARAMS);
  return `scrypt$${PARAMS.N}$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [alg, n, saltB64, hashB64] = stored.split("$");
  if (alg !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64");
  const actual = await scrypt(password.normalize("NFKC"), Buffer.from(saltB64, "base64"), expected.length, { ...PARAMS, N: Number(n) || PARAMS.N });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// Fixed dummy hash so unknown emails take the same time as wrong passwords.
const DUMMY = "scrypt$16384$AAAAAAAAAAAAAAAAAAAAAA==$" + Buffer.alloc(64).toString("base64");

export async function authenticate(email: string, password: string): Promise<AdminUser | null> {
  const user = getAdminUsers().find((u) => u.email === email.trim().toLowerCase());
  const ok = await verifyPassword(password, user?.passwordHash ?? DUMMY);
  return user && ok ? user : null;
}
