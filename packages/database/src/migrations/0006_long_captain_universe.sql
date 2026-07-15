DO $$ BEGIN
 CREATE TYPE "shipment_attempt_status" AS ENUM('PENDING', 'DISPATCHED', 'FAILED', 'COMPLETED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "shipment_status" AS ENUM('CREATED', 'PACKED', 'READY_FOR_PICKUP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'RETURNED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "shipping_label_format" AS ENUM('PDF', 'PNG', 'ZPL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "carriers" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "carriers_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "carrier_configurations" (
	"id" text PRIMARY KEY NOT NULL,
	"carrier_id" text NOT NULL,
	"environment" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"api_keys_reference" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipments" (
	"id" text PRIMARY KEY NOT NULL,
	"fulfillment_id" text NOT NULL,
	"status" "shipment_status" DEFAULT 'CREATED' NOT NULL,
	"shipping_address_snapshot" jsonb NOT NULL,
	"customer_name_snapshot" text NOT NULL,
	"customer_phone_snapshot" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipment_attempts" (
	"id" text PRIMARY KEY NOT NULL,
	"shipment_id" text NOT NULL,
	"carrier_id" text NOT NULL,
	"tracking_number" text NOT NULL,
	"tracking_hash" text NOT NULL,
	"status" "shipment_attempt_status" DEFAULT 'PENDING' NOT NULL,
	"carrier_metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "shipment_attempts_tracking_hash_unique" UNIQUE("tracking_hash")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipment_items" (
	"id" text PRIMARY KEY NOT NULL,
	"shipment_id" text NOT NULL,
	"order_item_id" text NOT NULL,
	"sku" text NOT NULL,
	"product_name" text NOT NULL,
	"variant_name" text NOT NULL,
	"quantity" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tracking_events" (
	"id" text PRIMARY KEY NOT NULL,
	"attempt_id" text NOT NULL,
	"internal_status" "shipment_status" NOT NULL,
	"location" text,
	"description" text,
	"timestamp" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipping_labels" (
	"id" text PRIMARY KEY NOT NULL,
	"attempt_id" text NOT NULL,
	"format" "shipping_label_format" NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipment_exceptions" (
	"id" text PRIMARY KEY NOT NULL,
	"attempt_id" text NOT NULL,
	"exception_type" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "proof_of_deliveries" (
	"id" text PRIMARY KEY NOT NULL,
	"attempt_id" text NOT NULL,
	"signature_url" text,
	"photo_url" text,
	"otp_verified" text,
	"receiver_name" text,
	"gps_latitude" numeric,
	"gps_longitude" numeric,
	"device_id" text,
	"delivery_timestamp" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "proof_of_deliveries_attempt_id_unique" UNIQUE("attempt_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "carrier_webhooks" (
	"id" text PRIMARY KEY NOT NULL,
	"carrier_id" text NOT NULL,
	"event_type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"status" text DEFAULT 'RECEIVED' NOT NULL,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "fulfillments" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "fulfillments" ADD COLUMN "warehouse_id" text DEFAULT 'default_warehouse' NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shipment_fulfillment_idx" ON "shipments" ("fulfillment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shipment_status_idx" ON "shipments" ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shipment_attempt_shipment_idx" ON "shipment_attempts" ("shipment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shipment_attempt_tracking_hash_idx" ON "shipment_attempts" ("tracking_hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shipment_attempt_tracking_number_idx" ON "shipment_attempts" ("tracking_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shipment_item_shipment_idx" ON "shipment_items" ("shipment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tracking_event_attempt_idx" ON "tracking_events" ("attempt_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shipping_label_attempt_idx" ON "shipping_labels" ("attempt_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shipment_exception_attempt_idx" ON "shipment_exceptions" ("attempt_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "carrier_webhook_carrier_idx" ON "carrier_webhooks" ("carrier_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "carrier_configurations" ADD CONSTRAINT "carrier_configurations_carrier_id_carriers_id_fk" FOREIGN KEY ("carrier_id") REFERENCES "carriers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipments" ADD CONSTRAINT "shipments_fulfillment_id_fulfillments_id_fk" FOREIGN KEY ("fulfillment_id") REFERENCES "fulfillments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipment_attempts" ADD CONSTRAINT "shipment_attempts_shipment_id_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipment_attempts" ADD CONSTRAINT "shipment_attempts_carrier_id_carriers_id_fk" FOREIGN KEY ("carrier_id") REFERENCES "carriers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipment_items" ADD CONSTRAINT "shipment_items_shipment_id_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_attempt_id_shipment_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "shipment_attempts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipping_labels" ADD CONSTRAINT "shipping_labels_attempt_id_shipment_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "shipment_attempts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipment_exceptions" ADD CONSTRAINT "shipment_exceptions_attempt_id_shipment_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "shipment_attempts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "proof_of_deliveries" ADD CONSTRAINT "proof_of_deliveries_attempt_id_shipment_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "shipment_attempts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "carrier_webhooks" ADD CONSTRAINT "carrier_webhooks_carrier_id_carriers_id_fk" FOREIGN KEY ("carrier_id") REFERENCES "carriers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
