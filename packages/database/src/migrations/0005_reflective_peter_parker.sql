DO $$ BEGIN
 CREATE TYPE "capture_strategy" AS ENUM('AUTOMATIC', 'MANUAL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "payment_intent_status" AS ENUM('REQUIRES_PAYMENT_METHOD', 'REQUIRES_ACTION', 'PROCESSING', 'SUCCEEDED', 'CANCELED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "payment_internal_status" AS ENUM('PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "refund_status" AS ENUM('PENDING', 'SUCCEEDED', 'FAILED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "webhook_status" AS ENUM('RECEIVED', 'VALIDATED', 'PROCESSED', 'FAILED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment_providers" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_providers_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "provider_configurations" (
	"id" text PRIMARY KEY NOT NULL,
	"provider_id" text NOT NULL,
	"environment" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"api_keys_reference" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment_intents" (
	"id" text PRIMARY KEY NOT NULL,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"status" "payment_intent_status" DEFAULT 'REQUIRES_PAYMENT_METHOD' NOT NULL,
	"capture_strategy" "capture_strategy" DEFAULT 'AUTOMATIC' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment_attempts" (
	"id" text PRIMARY KEY NOT NULL,
	"intent_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"idempotency_key" text NOT NULL,
	"status" "payment_internal_status" DEFAULT 'PENDING' NOT NULL,
	"failure_code" text,
	"failure_reason" text,
	"provider_metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_attempts_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"id" text PRIMARY KEY NOT NULL,
	"attempt_id" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"currency_precision" integer NOT NULL,
	"internal_status" "payment_internal_status" NOT NULL,
	"provider_metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payments_attempt_id_unique" UNIQUE("attempt_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "refunds" (
	"id" text PRIMARY KEY NOT NULL,
	"payment_id" text NOT NULL,
	"provider_refund_id" text,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"status" "refund_status" DEFAULT 'PENDING' NOT NULL,
	"provider_metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "webhook_events" (
	"id" text PRIMARY KEY NOT NULL,
	"provider_id" text NOT NULL,
	"event_type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"status" "webhook_status" DEFAULT 'RECEIVED' NOT NULL,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payment_attempt_intent_idx" ON "payment_attempts" ("intent_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payment_attempt_id_idx" ON "payments" ("attempt_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "refund_payment_idx" ON "refunds" ("payment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "webhook_provider_idx" ON "webhook_events" ("provider_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "webhook_status_idx" ON "webhook_events" ("status");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "provider_configurations" ADD CONSTRAINT "provider_configurations_provider_id_payment_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "payment_providers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment_attempts" ADD CONSTRAINT "payment_attempts_intent_id_payment_intents_id_fk" FOREIGN KEY ("intent_id") REFERENCES "payment_intents"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment_attempts" ADD CONSTRAINT "payment_attempts_provider_id_payment_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "payment_providers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_attempt_id_payment_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "payment_attempts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "refunds" ADD CONSTRAINT "refunds_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "webhook_events" ADD CONSTRAINT "webhook_events_provider_id_payment_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "payment_providers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
