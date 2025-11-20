-- Remove stage column from contacts table
ALTER TABLE "pg-drizzle_contact" DROP COLUMN IF EXISTS "stage";
DROP INDEX IF EXISTS "contact_stage_idx";

-- Create deals table
CREATE TABLE "pg-drizzle_deal" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"stage" text DEFAULT 'lead' NOT NULL,
	"value" text,
	"currency" text DEFAULT 'USD',
	"contact_id" text,
	"expected_close_date" timestamp with time zone,
	"probability" text,
	"notes" text,
	"created_by_id" text NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
-- Add foreign key constraints
ALTER TABLE "pg-drizzle_deal" ADD CONSTRAINT "pg-drizzle_deal_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "pg-drizzle_deal" ADD CONSTRAINT "pg-drizzle_deal_contact_id_pg-drizzle_contact_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."pg-drizzle_contact"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
-- Create indexes
CREATE INDEX "deal_created_by_idx" ON "pg-drizzle_deal" USING btree ("created_by_id");
CREATE INDEX "deal_contact_idx" ON "pg-drizzle_deal" USING btree ("contact_id");
CREATE INDEX "deal_stage_idx" ON "pg-drizzle_deal" USING btree ("stage");

