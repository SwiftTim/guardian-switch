import { pgTable, text, timestamp, uuid, integer, boolean, serial, pgIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').unique().notNull(),
    passwordHash: text('password_hash').notNull(),
    apiKey: uuid('api_key').defaultRandom().unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const pulses = pgTable('pulses', {
    id: serial('id').primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    deviceName: text('device_name'),
    deviceOs: text('device_os'),
    timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow(),
});

export const monitors = pgTable('monitors', {
    id: serial('id').primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    trustedEmail: text('trusted_email').notNull(),
    emergencyMessage: text('emergency_message'),
    thresholdHours: integer('threshold_hours').default(24),
    lastAlertSentAt: timestamp('last_alert_sent_at', { withTimezone: true }),
    isActive: boolean('is_active').default(true),
    lastPulseAt: timestamp('last_pulse_at', { withTimezone: true }),
}, (table) => ({
    idxMonitorsLastPulse: pgIndex('idx_monitors_last_pulse').on(table.lastPulseAt),
}));
