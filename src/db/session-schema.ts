import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const HSISession = sqliteTable('HSISession', {
  Id: integer('Id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  PersonId: integer('PersonId', { mode: 'number' }).notNull(),
  Session: text('Session').notNull(),
  IsVerified: integer('IsVerified', { mode: 'boolean' })
    .notNull()
    .default(false),
  Timestamp: text('Timestamp').notNull(),
  SignedIn: integer('SignedIn', { mode: 'boolean' }).notNull().default(false),
  Content: text('Content').notNull(),
})
