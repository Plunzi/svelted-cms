import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';

export const groups = sqliteTable('groups', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	createdAt: text('created_at').notNull(),
	updatedAt: text('updated_at').notNull()
});

export const files = sqliteTable('files', {
	route: text('route').primaryKey().notNull(),
	name: text('name').notNull(),
	extension: text('extension'),
	timestamp: text('timestamp').default('CURRENT_TIMESTAMP'),
	createdBy: text('created_by').references(() => users.id),
	editedBy: text('edited_by').references(() => users.id),

	perms_full_groups: text('perms_full_groups').references(() => groups.id),
	perms_full_users: text('perms_full_users').references(() => users.id),
	perms_view_groups: text('perms_view_groups').references(() => groups.id),
	perms_view_users: text('perms_view_users').references(() => users.id),
	perms_edit_groups: text('perms_edit_groups').references(() => groups.id),
	perms_edit_users: text('perms_edit_users').references(() => users.id),
	perms_delete_groups: text('perms_delete_groups').references(() => groups.id),
	perms_delete_users: text('perms_delete_users').references(() => users.id),

	perms_upload_groups: text('perms_upload_groups').references(() => groups.id),
	perms_upload_users: text('perms_upload_users').references(() => users.id),
	perms_download_groups: text('perms_download_groups').references(() => groups.id),
	perms_download_users: text('perms_download_users').references(() => users.id),
	perms_share_groups: text('perms_share_groups').references(() => groups.id),
	perms_share_users: text('perms_share_users').references(() => users.id)
});

export const folders = sqliteTable('folders', {
	route: text('route').primaryKey().notNull(),
	name: text('name').notNull(),
	extension: text('extension'),
	timestamp: text('timestamp').default('CURRENT_TIMESTAMP'),
	createdBy: text('created_by').references(() => users.id),
	editedBy: text('edited_by').references(() => users.id),

	perms_full_groups: text('perms_full_groups').references(() => groups.id),
	perms_full_users: text('perms_full_users').references(() => users.id),
	perms_view_groups: text('perms_view_groups').references(() => groups.id),
	perms_view_users: text('perms_view_users').references(() => users.id),
	perms_edit_groups: text('perms_edit_groups').references(() => groups.id),
	perms_edit_users: text('perms_edit_users').references(() => users.id),
	perms_delete_groups: text('perms_delete_groups').references(() => groups.id),
	perms_delete_users: text('perms_delete_users').references(() => users.id),

	perms_upload_groups: text('perms_upload_groups').references(() => groups.id),
	perms_upload_users: text('perms_upload_users').references(() => users.id),
	perms_download_groups: text('perms_download_groups').references(() => groups.id),
	perms_download_users: text('perms_download_users').references(() => users.id),
	perms_share_groups: text('perms_share_groups').references(() => groups.id),
	perms_share_users: text('perms_share_users').references(() => users.id)
});

export const users = sqliteTable('users', {
	// auth
	id: integer('id').primaryKey().notNull(),
	name: text('name', { length: 256 }).notNull(),
	email: text('email').notNull().unique(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).notNull(),
	password: text('password', { length: 256 }).notNull(),

	// information
	first_name: text('first_name', { length: 128 }),
	last_name: text('last_name', { length: 128 }),
	display_name: text('display_name', { length: 32 }).notNull(),
	location: text('location', { length: 128 }),
	title: text('title', { length: 128 }),
	description: text('description', { length: 256 }),
	image: text('image'), // avatar or profile image
	language: text('language', { length: 8 }),
	appearance: text('appearance', { length: 8 }).default('auto'),
	status: text('status', { length: 16 }),

	// meta
	created_at: text('created_at')
		.default(sql`(CURRENT_TIMESTAMP)`)
		.notNull(),
	updatedAt: text('updated_at').notNull()
	// created_by:
	// updated_at:
	// updated_by:
	// last_online:
	// roles
});

export const roles = sqliteTable('roles', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	createdAt: text('created_at').notNull(),
	updatedAt: text('updated_at').notNull()

	// users
});

export const userRoles = sqliteTable(
	'user_roles',
	{
		userId: text('user_id')
			.notNull()
			.references(() => users.id),
		roleId: text('role_id')
			.notNull()
			.references(() => roles.id)
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.roleId] })
	})
);

export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	expiresAt: text('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: text('created_at').notNull(),
	updatedAt: text('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => users.id)
});

export const accounts = sqliteTable('accounts', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: text('access_token_expires_at'),
	refreshTokenExpiresAt: text('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: text('created_at').notNull(),
	updatedAt: text('updated_at').notNull()
});

export const verifications = sqliteTable('verifications', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: text('expires_at').notNull(),
	createdAt: text('created_at'),
	updatedAt: text('updated_at')
});
