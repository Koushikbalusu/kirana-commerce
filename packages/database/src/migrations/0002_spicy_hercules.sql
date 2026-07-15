DO $$ BEGIN
 CREATE TYPE "discount_type" AS ENUM('PERCENTAGE', 'FIXED_AMOUNT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "promotion_action_type" AS ENUM('ORDER_DISCOUNT', 'ITEM_DISCOUNT', 'FREE_SHIPPING');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "promotion_condition_type" AS ENUM('MIN_CART_VALUE', 'INCLUDES_CATEGORY', 'INCLUDES_BRAND', 'USER_ROLE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "currencies" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"symbol" text NOT NULL,
	"precision" integer DEFAULT 2 NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "currencies_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prices" (
	"id" text PRIMARY KEY NOT NULL,
	"variant_id" text NOT NULL,
	"currency_id" text NOT NULL,
	"amount" integer NOT NULL,
	"msrp" integer,
	"starts_at" timestamp DEFAULT now() NOT NULL,
	"ends_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "price_history" (
	"id" text PRIMARY KEY NOT NULL,
	"price_id" text NOT NULL,
	"amount" integer NOT NULL,
	"recorded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "promotions" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"priority" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"starts_at" timestamp DEFAULT now() NOT NULL,
	"ends_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "promotion_conditions" (
	"id" text PRIMARY KEY NOT NULL,
	"promotion_id" text NOT NULL,
	"type" "promotion_condition_type" NOT NULL,
	"parameters" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "promotion_actions" (
	"id" text PRIMARY KEY NOT NULL,
	"promotion_id" text NOT NULL,
	"type" "promotion_action_type" NOT NULL,
	"discount_type" "discount_type" NOT NULL,
	"discount_value" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coupons" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"description" text,
	"discount_type" "discount_type" NOT NULL,
	"discount_value" integer NOT NULL,
	"max_uses" integer,
	"current_uses" integer DEFAULT 0 NOT NULL,
	"eligibility_rules" jsonb,
	"can_stack" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "coupons_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tax_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"rate_percentage" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tax_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "variant_time_idx" ON "prices" ("variant_id","starts_at","ends_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "history_price_id_idx" ON "price_history" ("price_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "promo_time_idx" ON "promotions" ("starts_at","ends_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "coupon_code_idx" ON "coupons" ("code");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prices" ADD CONSTRAINT "prices_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prices" ADD CONSTRAINT "prices_currency_id_currencies_id_fk" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "price_history" ADD CONSTRAINT "price_history_price_id_prices_id_fk" FOREIGN KEY ("price_id") REFERENCES "prices"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "promotion_conditions" ADD CONSTRAINT "promotion_conditions_promotion_id_promotions_id_fk" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "promotion_actions" ADD CONSTRAINT "promotion_actions_promotion_id_promotions_id_fk" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
