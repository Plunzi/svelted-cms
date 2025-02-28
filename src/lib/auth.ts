import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import * as schema from './server/db/postgre_schema';
import { db } from './server/db';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite', // or "pg" or "mysql"
		schema: {
			...schema,
			user: schema.users
		},
		//if all of them are just using plural form, you can just pass the option below
		usePlural: true
	}),
	emailAndPassword: {
		enabled: true
	},
	socialProviders: {
		// github: {
		// 	clientId: process.env.GITHUB_CLIENT_ID,
		// 	clientSecret: process.env.GITHUB_CLIENT_SECRET
		// }
	}
});
