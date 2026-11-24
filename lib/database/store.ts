import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { CollectionMap, CollectionName } from "@/lib/types";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";
import { seedFor } from "./seed";

/**
 * Storage-agnostic record store.
 *
 * - With SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY set, records live in the
 *   `records` table (see supabase/schema.sql) and are only ever accessed from
 *   the server with the service-role key.
 * - Otherwise records live in a JSON file under DATA_DIR (default `.data/`),
 *   which suits local development and single-server self-hosting.
 *
 * Content collections are seeded from /data on first read so a fresh install
 * has a complete website; after that, the admin owns the content.
 */

type Item<C extends CollectionName> = CollectionMap[C];
type Db = Partial<Record<CollectionName | "_meta", unknown[]>>;

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");

let writeChain: Promise<unknown> = Promise.resolve();
let memo: { db: Db; mtime: number } | null = null;

async function readDb(): Promise<Db> {
  try {
    const stat = await fs.stat(DB_FILE);
    if (memo && memo.mtime === stat.mtimeMs) return memo.db;
    const db = JSON.parse(await fs.readFile(DB_FILE, "utf8")) as Db;
    memo = { db, mtime: stat.mtimeMs };
    return db;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw err;
  }
}

async function writeDb(mutator: (db: Db) => void) {
  const run = async () => {
    const db = structuredClone(await readDb());
    mutator(db);
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tmp = `${DB_FILE}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(db, null, 2));
    await fs.rename(tmp, DB_FILE);
    memo = null;
  };
  const next = writeChain.then(run, run);
  writeChain = next.catch(() => undefined);
  return next;
}

/* ---------------- file driver ---------------- */

const fileDriver = {
  async list<C extends CollectionName>(c: C): Promise<Item<C>[]> {
    const db = await readDb();
    if (db[c] === undefined) {
      const seed = seedFor(c);
      if (seed) {
        try {
          await writeDb((d) => {
            if (d[c] === undefined) d[c] = seed;
          });
        } catch {
          // Read-only filesystem (e.g. serverless without Supabase): serve seed data.
        }
        return seed as Item<C>[];
      }
      return [];
    }
    return db[c] as Item<C>[];
  },
  async upsert<C extends CollectionName>(c: C, item: Item<C>) {
    await this.list(c);
    await writeDb((d) => {
      const arr = (d[c] as Item<C>[] | undefined) ?? [];
      const i = arr.findIndex((x) => (x as { id: string }).id === (item as { id: string }).id);
      if (i >= 0) arr[i] = item;
      else arr.push(item);
      d[c] = arr;
    });
    return item;
  },
  async remove(c: CollectionName, id: string) {
    await this.list(c);
    await writeDb((d) => {
      d[c] = ((d[c] as { id: string }[] | undefined) ?? []).filter((x) => x.id !== id);
    });
  },
};

/* ---------------- supabase driver ---------------- */

const supabaseDriver = {
  async list<C extends CollectionName>(c: C): Promise<Item<C>[]> {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb.from("records").select("id,data").eq("collection", c);
    if (error) throw new Error(`Supabase list ${c}: ${error.message}`);
    if (data.length === 0) {
      const seed = seedFor(c);
      if (seed) {
        const { data: meta } = await sb.from("records").select("id").eq("collection", "_meta").eq("id", c).maybeSingle();
        if (!meta) {
          const rows = seed.map((s) => ({ collection: c, id: (s as { id: string }).id, data: s }));
          await sb.from("records").upsert([...rows, { collection: "_meta", id: c, data: { seededAt: new Date().toISOString() } }]);
          return seed as Item<C>[];
        }
      }
    }
    return data.map((r) => r.data as Item<C>);
  },
  async upsert<C extends CollectionName>(c: C, item: Item<C>) {
    const sb = getSupabaseAdmin();
    await this.list(c);
    const { error } = await sb
      .from("records")
      .upsert({ collection: c, id: (item as { id: string }).id, data: item, updated_at: new Date().toISOString() });
    if (error) throw new Error(`Supabase upsert ${c}: ${error.message}`);
    return item;
  },
  async remove(c: CollectionName, id: string) {
    const sb = getSupabaseAdmin();
    const { error } = await sb.from("records").delete().eq("collection", c).eq("id", id);
    if (error) throw new Error(`Supabase delete ${c}: ${error.message}`);
  },
};

const driver = () => (isSupabaseConfigured() ? supabaseDriver : fileDriver);

export const store = {
  backend: () => (isSupabaseConfigured() ? "supabase" : "file") as "supabase" | "file",
  list: <C extends CollectionName>(c: C) => driver().list(c),
  async get<C extends CollectionName>(c: C, id: string): Promise<Item<C> | undefined> {
    const items = await driver().list(c);
    return items.find((x) => (x as { id: string }).id === id);
  },
  upsert: <C extends CollectionName>(c: C, item: Item<C>) => driver().upsert(c, item),
  remove: (c: CollectionName, id: string) => driver().remove(c, id),
};
