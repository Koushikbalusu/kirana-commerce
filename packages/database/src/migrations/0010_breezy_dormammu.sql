CREATE TABLE IF NOT EXISTS "customer_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"dob" date,
	"gender" text,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"avatar_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "customer_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_addresses" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"is_default_billing" boolean DEFAULT false NOT NULL,
	"is_default_shipping" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "address_versions" (
	"id" text PRIMARY KEY NOT NULL,
	"address_id" text NOT NULL,
	"version" integer NOT NULL,
	"line1" text NOT NULL,
	"line2" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"zip" text NOT NULL,
	"country" text NOT NULL,
	"lat" text,
	"long" text,
	"landmark" text,
	"instructions" text,
	"validation_status" text DEFAULT 'UNVALIDATED' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_contacts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"value" text NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"verification_provider" text,
	"verification_attempts" text,
	"verified_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_wishlists" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"visibility" text DEFAULT 'PRIVATE' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_wishlist_items" (
	"id" text PRIMARY KEY NOT NULL,
	"wishlist_id" text NOT NULL,
	"product_id" text NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_payment_references" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider" text NOT NULL,
	"token" text NOT NULL,
	"last4" text,
	"exp_month" text,
	"exp_year" text,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_loyalty_ledger" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"transaction_type" text NOT NULL,
	"points" integer NOT NULL,
	"rule_id" text,
	"tier_id" text,
	"expiry_date" timestamp,
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_notes" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"author_id" text NOT NULL,
	"note_type" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_metadata" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"tags" jsonb,
	"segments" jsonb,
	"labels" jsonb,
	"custom_attributes" jsonb,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "customer_metadata_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_preferences" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"theme" text DEFAULT 'system' NOT NULL,
	"accessibility" jsonb,
	"marketing" jsonb,
	"shopping" jsonb,
	"privacy" jsonb,
	"notifications" jsonb,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "customer_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_timeline" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"event_type" text NOT NULL,
	"metadata" jsonb,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cust_prof_status_idx" ON "customer_profiles" ("user_id","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cust_addr_user_type_idx" ON "customer_addresses" ("user_id","type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "addr_ver_idx" ON "address_versions" ("address_id","version");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cust_contact_idx" ON "customer_contacts" ("user_id","type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cust_wishlist_idx" ON "customer_wishlists" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wishlist_item_idx" ON "customer_wishlist_items" ("wishlist_id","product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cust_payref_idx" ON "customer_payment_references" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cust_loyalty_idx" ON "customer_loyalty_ledger" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cust_notes_idx" ON "customer_notes" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cust_meta_idx" ON "customer_metadata" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cust_prefs_idx" ON "customer_preferences" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cust_timeline_idx" ON "customer_timeline" ("user_id","timestamp");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_profiles" ADD CONSTRAINT "customer_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "address_versions" ADD CONSTRAINT "address_versions_address_id_customer_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "customer_addresses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_contacts" ADD CONSTRAINT "customer_contacts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_wishlists" ADD CONSTRAINT "customer_wishlists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_wishlist_items" ADD CONSTRAINT "customer_wishlist_items_wishlist_id_customer_wishlists_id_fk" FOREIGN KEY ("wishlist_id") REFERENCES "customer_wishlists"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_payment_references" ADD CONSTRAINT "customer_payment_references_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_loyalty_ledger" ADD CONSTRAINT "customer_loyalty_ledger_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_notes" ADD CONSTRAINT "customer_notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_metadata" ADD CONSTRAINT "customer_metadata_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_preferences" ADD CONSTRAINT "customer_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_timeline" ADD CONSTRAINT "customer_timeline_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
