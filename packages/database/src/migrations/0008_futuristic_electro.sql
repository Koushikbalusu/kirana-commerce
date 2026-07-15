CREATE TABLE IF NOT EXISTS "search_indices" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"provider" text NOT NULL,
	"settings" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "search_indices_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "search_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"index_id" text NOT NULL,
	"product_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"brand" text,
	"category" text,
	"attributes" jsonb,
	"thumbnail" text,
	"availability" boolean DEFAULT false NOT NULL,
	"search_price" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "search_suggestions" (
	"id" text PRIMARY KEY NOT NULL,
	"term" text NOT NULL,
	"weight" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "search_suggestions_term_unique" UNIQUE("term")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "search_synonyms" (
	"id" text PRIMARY KEY NOT NULL,
	"root_term" text NOT NULL,
	"synonyms" jsonb NOT NULL,
	"is_bidirectional" boolean DEFAULT true NOT NULL,
	"locale" text DEFAULT 'en' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "search_analytics" (
	"id" text PRIMARY KEY NOT NULL,
	"term" text NOT NULL,
	"query_count" integer DEFAULT 0 NOT NULL,
	"click_count" integer DEFAULT 0 NOT NULL,
	"zero_result_count" integer DEFAULT 0 NOT NULL,
	"recorded_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "search_events" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"event_type" text NOT NULL,
	"term" text,
	"document_id" text,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "search_doc_index_idx" ON "search_documents" ("index_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "search_doc_product_idx" ON "search_documents" ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "search_sugg_term_idx" ON "search_suggestions" ("term");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "search_syn_root_term_idx" ON "search_synonyms" ("root_term");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "search_analytics_term_date_idx" ON "search_analytics" ("term","recorded_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "search_event_session_idx" ON "search_events" ("session_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "search_event_type_idx" ON "search_events" ("event_type");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "search_documents" ADD CONSTRAINT "search_documents_index_id_search_indices_id_fk" FOREIGN KEY ("index_id") REFERENCES "search_indices"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
