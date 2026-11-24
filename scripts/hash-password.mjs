// Usage: npm run admin:hash -- "a long passphrase"
import { scryptSync, randomBytes } from "node:crypto";

const pw = process.argv[2];
if (!pw || pw.length < 12) {
  console.error("Provide a password of at least 12 characters: npm run admin:hash -- \"your passphrase\"");
  process.exit(1);
}
const salt = randomBytes(16);
const hash = scryptSync(pw.normalize("NFKC"), salt, 64, { N: 16384, r: 8, p: 1 });
console.log(`scrypt$16384$${salt.toString("base64")}$${hash.toString("base64")}`);
