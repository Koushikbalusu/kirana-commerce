import fs from 'fs';
import path from 'path';

const rootDir = '/home/koushik/Documents/kirana-commerce';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ----------------------------------------------------------------------
// 1. DATABASE SCHEMA
// ----------------------------------------------------------------------
const dbSchemaTables = path.join(rootDir, 'packages/database/src/schema/tables');
const dbSchemaRelations = path.join(rootDir, 'packages/database/src/schema/relations');
const dbSchemaEnums = path.join(rootDir, 'packages/database/src/schema/enums');

ensureDir(dbSchemaTables);
ensureDir(dbSchemaRelations);
ensureDir(dbSchemaEnums);

fs.writeFileSync(
  path.join(dbSchemaTables, 'notification_providers.ts'),
  `
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const notificationProviders = pgTable("notification_providers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(), // e.g. SENDGRID, TWILIO
  channel: text("channel").notNull(), // EMAIL, SMS, PUSH, WHATSAPP
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'notification_provider_configs.ts'),
  `
import { pgTable, text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { notificationProviders } from "./notification_providers";

export const notificationProviderConfigs = pgTable("notification_provider_configs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  providerId: text("provider_id").notNull().references(() => notificationProviders.id, { onDelete: "cascade" }),
  isActive: boolean("is_active").default(false).notNull(),
  isFallback: boolean("is_fallback").default(false).notNull(),
  config: jsonb("config"), // e.g. api keys
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'notifications.ts'),
  `
import { pgTable, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  channel: text("channel").notNull(),
  category: text("category").notNull(), // TRANSACTIONAL, MARKETING
  status: text("status").default("PENDING").notNull(), // PENDING, SCHEDULED, PROCESSING, DELIVERED, FAILED, CANCELED
  subject: text("subject"),
  body: text("body").notNull(),
  templateVersionId: text("template_version_id"),
  metadata: jsonb("metadata"),
  scheduledFor: timestamp("scheduled_for"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  userStatusIdx: index("notif_user_status_idx").on(t.userId, t.status),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'delivery_attempts.ts'),
  `
import { pgTable, text, timestamp, index, jsonb } from "drizzle-orm/pg-core";
import { notifications } from "./notifications";

export const deliveryAttempts = pgTable("delivery_attempts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  notificationId: text("notification_id").notNull().references(() => notifications.id, { onDelete: "cascade" }),
  providerId: text("provider_id"),
  status: text("status").notNull(), // PENDING, SENT, DELIVERED, FAILED
  providerReferenceId: text("provider_reference_id"),
  errorDetails: jsonb("error_details"),
  attemptNumber: text("attempt_number").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  notifIdx: index("del_attempt_notif_idx").on(t.notificationId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'notification_templates.ts'),
  `
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const notificationTemplates = pgTable("notification_templates", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  key: text("key").notNull().unique(), // e.g. "ORDER_CONFIRMATION"
  channel: text("channel").notNull(),
  category: text("category").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'template_versions.ts'),
  `
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { notificationTemplates } from "./notification_templates";

export const templateVersions = pgTable("template_versions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  templateId: text("template_id").notNull().references(() => notificationTemplates.id, { onDelete: "cascade" }),
  version: text("version").notNull(),
  locale: text("locale").default("en").notNull(),
  subject: text("subject"),
  body: text("body").notNull(),
  isActive: boolean("is_active").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  templateIdx: index("tpl_ver_template_idx").on(t.templateId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'user_notification_preferences.ts'),
  `
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const userNotificationPreferences = pgTable("user_notification_preferences", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  channel: text("channel").notNull(),
  category: text("category").notNull(), // TRANSACTIONAL, MARKETING, SECURITY, SYSTEM
  isEnabled: boolean("is_enabled").default(true).notNull(),
  quietHoursStart: text("quiet_hours_start"), // HH:mm
  quietHoursEnd: text("quiet_hours_end"), // HH:mm
  timezone: text("timezone").default("UTC").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  userChannelCategoryIdx: index("user_pref_idx").on(t.userId, t.channel, t.category),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'in_app_notifications.ts'),
  `
import { pgTable, text, timestamp, boolean, index, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";

export const inAppNotifications = pgTable("in_app_notifications", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  priority: text("priority").default("NORMAL").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  isArchived: boolean("is_archived").default(false).notNull(),
  isPinned: boolean("is_pinned").default(false).notNull(),
  readAt: timestamp("read_at"),
  expiresAt: timestamp("expires_at"),
  deepLink: text("deep_link"),
  actionButtons: jsonb("action_buttons"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  userReadIdx: index("in_app_user_read_idx").on(t.userId, t.isRead),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'notification_attachments.ts'),
  `
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { notifications } from "./notifications";

export const notificationAttachments = pgTable("notification_attachments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  notificationId: text("notification_id").notNull().references(() => notifications.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(), // PDF, CSV, IMAGE
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  notifIdx: index("notif_attach_idx").on(t.notificationId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'notification_analytics.ts'),
  `
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { notifications } from "./notifications";

export const notificationAnalytics = pgTable("notification_analytics", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  notificationId: text("notification_id").notNull().references(() => notifications.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(), // DELIVERED, OPENED, CLICKED, DISMISSED, UNSUBSCRIBED
  providerLatencyMs: text("provider_latency_ms"),
  retryCount: text("retry_count"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  notifEventIdx: index("notif_analytic_idx").on(t.notificationId, t.eventType),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'notification_webhooks.ts'),
  `
import { pgTable, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";

export const notificationWebhooks = pgTable("notification_webhooks", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  providerId: text("provider_id").notNull(),
  providerReferenceId: text("provider_reference_id"),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload").notNull(),
  status: text("status").default("RECEIVED").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  refIdx: index("notif_webhook_ref_idx").on(t.providerReferenceId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaRelations, 'notifications.ts'),
  `
import { relations } from "drizzle-orm";
import { notifications } from "../tables/notifications";
import { deliveryAttempts } from "../tables/delivery_attempts";

export const notificationRelations = relations(notifications, ({ many }) => ({
  attempts: many(deliveryAttempts),
}));

export const deliveryAttemptRelations = relations(deliveryAttempts, ({ one }) => ({
  notification: one(notifications, {
    fields: [deliveryAttempts.notificationId],
    references: [notifications.id],
  }),
}));
`,
);

// Append to schema index
const schemaIndexPath = path.join(rootDir, 'packages/database/src/schema/index.ts');
let schemaIndex = fs.readFileSync(schemaIndexPath, 'utf8');
const newExports = `
// Notifications
export * from "./tables/notification_providers";
export * from "./tables/notification_provider_configs";
export * from "./tables/notifications";
export * from "./tables/delivery_attempts";
export * from "./tables/notification_templates";
export * from "./tables/template_versions";
export * from "./tables/user_notification_preferences";
export * from "./tables/in_app_notifications";
export * from "./tables/notification_attachments";
export * from "./tables/notification_analytics";
export * from "./tables/notification_webhooks";
export * from "./relations/notifications";
`;
if (!schemaIndex.includes('./tables/notifications')) {
  fs.writeFileSync(schemaIndexPath, schemaIndex.trim() + '\n' + newExports);
}

// ----------------------------------------------------------------------
// 2. NOTIFICATIONS PACKAGE (Vertical Slices)
// ----------------------------------------------------------------------
const pkgDir = path.join(rootDir, 'packages/notifications');
const srcDir = path.join(pkgDir, 'src');

[
  'notification',
  'routing',
  'template',
  'renderer',
  'preference',
  'attempt',
  'providers',
  'queue',
  'analytics',
  'webhook',
  'attachments',
  'in-app',
  'shared',
].forEach((dir) => {
  ensureDir(path.join(srcDir, dir));
});

fs.writeFileSync(
  path.join(pkgDir, 'package.json'),
  JSON.stringify(
    {
      name: '@kirana/notifications',
      version: '0.1.0',
      private: true,
      main: './src/index.ts',
      types: './src/index.ts',
      dependencies: {
        zod: '^3.23.8',
        '@kirana/database': '*',
        '@kirana/types': '*',
      },
      devDependencies: {
        typescript: '^5.0.0',
        '@types/node': '^20.0.0',
      },
    },
    null,
    2,
  ),
);

fs.writeFileSync(
  path.join(pkgDir, 'tsconfig.json'),
  JSON.stringify(
    {
      extends: '../../tsconfig.base.json',
      compilerOptions: {
        paths: {
          '@/*': ['./src/*'],
        },
      },
      include: ['src'],
    },
    null,
    2,
  ),
);

// Shared Value Objects & Provider Abstraction
fs.writeFileSync(
  path.join(srcDir, 'shared/index.ts'),
  `
export interface NotificationSnapshot {
  readonly recipient: string;
  readonly channel: string;
  readonly subject: string;
  readonly body: string;
  readonly templateVersionId: string;
  readonly metadata: any;
}

export interface NotificationRecipient {
  readonly userId: string;
  readonly contactPoint: string;
}

export interface NotificationChannel {
  readonly name: 'EMAIL' | 'SMS' | 'PUSH' | 'WHATSAPP';
}

export interface NotificationPriority {
  readonly level: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
}

export interface QuietHours {
  readonly start: string;
  readonly end: string;
  readonly timezone: string;
  readonly bypassCritical: boolean;
}

export interface RenderedTemplate {
  readonly subject: string;
  readonly body: string;
}

export interface DeliveryResult {
  readonly success: boolean;
  readonly providerReference?: string;
  readonly error?: any;
}

export interface DeliveryRoute {
  readonly primaryChannel: string;
  readonly fallbackChannels: string[];
}

export interface NotificationProviderAdapter {
  send(payload: any): Promise<DeliveryResult>;
  validate(payload: any): boolean;
  healthCheck(): Promise<boolean>;
  cancel(providerReferenceId: string): Promise<boolean>;
}

export class EmailAdapter implements NotificationProviderAdapter {
  async send(p: any) { return { success: true }; }
  validate(p: any) { return true; }
  async healthCheck() { return true; }
  async cancel(r: string) { return true; }
}

export class SmsAdapter implements NotificationProviderAdapter {
  async send(p: any) { return { success: true }; }
  validate(p: any) { return true; }
  async healthCheck() { return true; }
  async cancel(r: string) { return true; }
}

export class PushAdapter implements NotificationProviderAdapter {
  async send(p: any) { return { success: true }; }
  validate(p: any) { return true; }
  async healthCheck() { return true; }
  async cancel(r: string) { return true; }
}

export class WhatsAppAdapter implements NotificationProviderAdapter {
  async send(p: any) { return { success: true }; }
  validate(p: any) { return true; }
  async healthCheck() { return true; }
  async cancel(r: string) { return true; }
}

// Events
export interface ShippingEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
}
export type NotificationQueued = ShippingEvent;
export type NotificationScheduled = ShippingEvent;
export type NotificationSent = ShippingEvent;
export type NotificationDelivered = ShippingEvent;
export type NotificationOpened = ShippingEvent;
export type NotificationClicked = ShippingEvent;
export type NotificationFailed = ShippingEvent;
export type NotificationRetried = ShippingEvent;
export type NotificationCanceled = ShippingEvent;
export type TemplateRendered = ShippingEvent;
export type PreferenceUpdated = ShippingEvent;
export type ProviderUnavailable = ShippingEvent;
`,
);

// Slices Scaffold
const slices = [
  'notification',
  'routing',
  'template',
  'renderer',
  'preference',
  'attempt',
  'providers',
  'queue',
  'analytics',
  'webhook',
  'attachments',
  'in-app',
];

slices.forEach((slice) => {
  const cName = slice
    .replace(/-./g, (x) => x[1].toUpperCase())
    .replace(/^./, (x) => x.toUpperCase());
  fs.writeFileSync(
    path.join(srcDir, slice, 'entity.ts'),
    `export interface ${cName}Entity { id: string; }`,
  );
  fs.writeFileSync(path.join(srcDir, slice, 'repository.ts'), `export class ${cName}Repository {}`);
  fs.writeFileSync(
    path.join(srcDir, slice, 'validator.ts'),
    `import { z } from "zod"; export const schema = z.any();`,
  );
  fs.writeFileSync(path.join(srcDir, slice, 'dto.ts'), `export interface ${cName}DTO {}`);
  fs.writeFileSync(path.join(srcDir, slice, 'mapper.ts'), `export function map() {}`);

  if (['notification', 'template', 'preference', 'in-app'].includes(slice)) {
    fs.writeFileSync(
      path.join(srcDir, slice, 'service.ts'),
      `
    export class ${cName}Service {
      async execute(payload: any): Promise<any> { throw new Error("Not implemented"); }
    }
    `,
    );
    fs.writeFileSync(
      path.join(srcDir, slice, 'index.ts'),
      `
    export * from "./entity";
    export * from "./dto";
    export { ${cName}Service } from "./service";
    `,
    );
  } else {
    fs.writeFileSync(
      path.join(srcDir, slice, 'service.ts'),
      `
    export class ${cName}Service {
      async execute(payload: any): Promise<any> { throw new Error("Not implemented"); }
    }
    `,
    );
    fs.writeFileSync(
      path.join(srcDir, slice, 'index.ts'),
      `
    export * from "./entity";
    export * from "./dto";
    `,
    );
  }
});

// Main Public API Barrel
fs.writeFileSync(
  path.join(srcDir, 'index.ts'),
  `
export * from "./shared";
export { NotificationService } from "./notification";
export { TemplateService } from "./template";
export { PreferenceService } from "./preference";
export { InAppService } from "./in-app";
`,
);

console.log('Notifications workspace scaffolded.');
