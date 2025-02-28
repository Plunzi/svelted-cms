// import { drizzle } from 'drizzle-orm/better-sqlite3';
// import Database from 'better-sqlite3';

// import { env } from '$env/dynamic/private';
// if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
// const client = new Database(env.DATABASE_URL);
// export const db = drizzle(client);

import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// const queryClient = postgres(process.env.DATABASE_URL!);

const queryClient = postgres({
    hostname: env.PG_HOSTNAME!,
    port: Number(env.PG_PORT!),
    username: env.PG_USERNAME!,
    password: env.PG_PASSWORD!,
    database: env.PG_DATABASE!
});

export const db = drizzle({ client: queryClient });
