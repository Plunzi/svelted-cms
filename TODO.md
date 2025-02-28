# TODO

-  remove ``/public`` ``/private`` folders and make all part of ``/assets``.
-  file permissions should be managed by the database



Get all entries in a foder:

Option 1:

```sql
SELECT * 
FROM files
WHERE route LIKE '/parent-folder/%';
```

Option 2:

add parent folder entry to all files/folders

```sql
SELECT * 
FROM files
WHERE parent_folder = '/parent-folder';
```

To query folder content we need to know what contained files the user is allowed to see.
Therefore we need to know all ``allowed groups`` and all ``allowed users`` for each folder entry.

### File Table

> route ``varchar(32767)``
> name ``varchar(256)``
> extension
> timestamp

```
permissions_view: ['everyone']
permissions_edit: ['admins', 'developer']
permissions_delete: ['admins']
```



### Folder Table

> route: ``varchar(32767)``
> name ``varchar(256)``
> extension ``varchar?()``
> timestamp

```
permissions_view: ['everyone']
permissions_create: ['admins', 'developer']
permissions_edit: ['admins', 'developer']
permissions_delete: ['admins']
```


### Permissions Table



## Sqlite Schema

```js
import { sqliteTable, integer, text, primaryKey } from 'drizzle-orm/sqlite-core';
```

```js
// File Table --- Sqlite
export const files = sqliteTable('files', {
    route: text('route').primaryKey().notNull(),
    name: text('name').notNull(),
    extension: text('extension'),
    timestamp: text('timestamp').default('CURRENT_TIMESTAMP'),
});
```

```js
// Folder Table --- Sqlite
export const folders = sqliteTable('folders', {
    route: text('route').primaryKey().notNull(),
    name: text('name').notNull(),
    extension: text('extension'),
    timestamp: text('timestamp').default('CURRENT_TIMESTAMP'),
});
```

```js
// Permissions Table --- Sqlite
export const permissions = sqliteTable('permissions', {
    id: integer('id').primaryKey().autoincrement(),
    entityType: text('entity_type').notNull(), // 'file' or 'folder'
    entityId: text('entity_id').notNull(), // Route of the file or folder
    roleId: integer('role_id').notNull(), // Role ID from user_roles
    permissionType: text('permission_type').notNull(), // 'view', 'edit', 'create', 'delete'
    
    // Foreign Keys
    foreignKeys: {
        entityFile: {
            columns: ['entity_id'],
            references: 'files(route)',
            onDelete: 'cascade',
        },
        entityFolder: {
            columns: ['entity_id'],
            references: 'folders(route)',
            onDelete: 'cascade',
        },
        role: {
            columns: ['role_id'],
            references: 'user_roles(id)',
            onDelete: 'cascade',
        },
    },
});
```

## PostgreSQL Schema

```js
import { pgTable, serial, varchar, primaryKey } from 'drizzle-orm/pg-core';
```

```js
// File Table
export const files = pgTable('files', {
    route: varchar('route', 32767).primaryKey().notNull(),
    name: varchar('name', 256).notNull(),
    extension: varchar('extension', 256),
    timestamp('timestamp').notNull().defaultNow(),
});
```

```js
// Folder Table
export const folders = pgTable('folders', {
    route: varchar('route', 32767).primaryKey().notNull(),
    name: varchar('name', 256).notNull(),
    extension: varchar('extension', 256),
    timestamp('timestamp').notNull().defaultNow(),
});
```

```js
// Permissions Table
export const permissions = pgTable('permissions', {
    id: serial('id').primaryKey(),
    entityType: varchar('entity_type', 50).notNull(), // 'file' or 'folder'
    entityId: varchar('entity_id', 32767).notNull(), // Route of the file or folder
    roleId: serial('role_id').notNull(), // Role ID from user_roles
    permissionType: varchar('permission_type', 50).notNull(), // 'view', 'edit', 'create', 'delete'
    
    // Foreign Keys
    foreignKeys: {
        entityFile: {
            columns: ['entity_id'],
            references: 'files(route)',
            onDelete: 'cascade',
        },
        entityFolder: {
            columns: ['entity_id'],
            references: 'folders(route)',
            onDelete: 'cascade',
        },
        role: {
            columns: ['role_id'],
            references: 'user_roles(id)',
            onDelete: 'cascade',
        },
    },
});
```