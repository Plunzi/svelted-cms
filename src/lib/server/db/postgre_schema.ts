import { varchar, pgTable, timestamp, boolean, integer, text, serial } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    // auth
    id:            serial('id').primaryKey().notNull(),
    name:          varchar('name', { length: 256 }).notNull(),
    email:         text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull(),
    password:      varchar('password', { length: 256 }).notNull(),


    // information
    first_name:    varchar('first_name', { length: 128 }), 
    last_name:     varchar('last_name', { length: 128 }), 
    display_name:  varchar('display_name', { length: 32 }).notNull(),
    location:      varchar('location', { length: 128 }),
    title:         varchar('title', { length: 128 }),
    description:   varchar('description', { length: 256 }),
    image:         text('image'), // avatar or profile image
    language:      varchar('language', { length: 8 }),
    appearance:    varchar('appearance', { length: 8 }).default('auto'),
    status:        varchar('status', { length: 16 }),

    // meta
    created_at:    timestamp('created_at').notNull(),
    updatedAt:     timestamp('updated_at').notNull()
    // created_by: TEXT NOT NULL,
    // updated_at: TEXT,
    // updated_by: TEXT,
    // last_online: TEXT,
    // role_id: INTEGER,
    // FOREIGN: KEY (role_id) REFERENCES roles(id)
});

export const sessions = pgTable('sessions', {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
        .notNull()
        .references(() => users.id)
});


export const accounts = pgTable('accounts', {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull()
});

export const verifications = pgTable('verifications', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at')
});


/*

export const group = pgTable('group', {
    id: varchar('id', { length: 256 }).primaryKey().notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    created_at: timestamp('created_at').notNull(),
    created_by: "",
    modified_at: timestamp('modified_at').notNull(),
    modified_by: "",

    // permissions only for default files/folders without specific permissions
    perm_full_control: boolean(),// >< groups
    perm_view: boolean(),// >< groups
    perm_modify: boolean(),// >< groups
    perm_move: boolean(),// >< groups
    perm_delete: boolean(),// >< groups
    perm_share: boolean(),// >< groups nullable
    perm_download: boolean(),// >< groups nullable
    perm_review: boolean(),// >< groups nullable
});

export const file = pgTable('file', {
    route: varchar('route', { length: 32767 }).primaryKey().notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    extension: varchar('extension', { length: 256 }),
    created_at: timestamp('created_at').notNull(),
    created_by: "",
    modified_at: timestamp('modified_at').notNull(),
    modified_by: "",

    // permissions
    perm_full_control_groups: "",// >< groups
    perm_full_control_users: "",// >< users
    perm_view_groups: "",// >< groups
    perm_view_users: "",// >< users
    perm_modify_groups: "",// >< groups
    perm_modify_users: "",// >< users
    perm_move_groups: "",// >< groups
    perm_move_users: "",// >< users
    perm_delete_groups: "",// >< groups
    perm_delete_users: "",// >< users
    perm_share_groups: "",// >< groups nullable
    perm_share_users: "",// users relation nullable
    perm_download_users: "",// >< groups nullable
    perm_download_users: "",// users relation nullable
    perm_review_users: "",// >< groups nullable
    perm_review_users: ""
});

export const folder = pgTable('folder', {
    route: varchar('route', { length: 32767 }).primaryKey().notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    extension: varchar('extension', { length: 256 }),
});

*/