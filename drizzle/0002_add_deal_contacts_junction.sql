-- Migration: Add deal_contact junction table for many-to-many relationship
-- This migration:
-- 1. Creates the deal_contact junction table
-- 2. Migrates existing contactId data (if any) to the junction table
-- 3. Drops the old contactId column from deals table

-- Step 1: Create the junction table
CREATE TABLE IF NOT EXISTS "pg-drizzle_deal_contact" (
	"id" text PRIMARY KEY NOT NULL,
	"deal_id" text NOT NULL,
	"contact_id" text NOT NULL,
	"createdAt" timestamp with time zone NOT NULL DEFAULT now()
);

-- Step 2: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "deal_contact_deal_idx" ON "pg-drizzle_deal_contact"("deal_id");
CREATE INDEX IF NOT EXISTS "deal_contact_contact_idx" ON "pg-drizzle_deal_contact"("contact_id");

-- Step 3: Add foreign key constraints
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'pg-drizzle_deal_contact_deal_id_pg-drizzle_deal_id_fk'
    ) THEN
        ALTER TABLE "pg-drizzle_deal_contact" 
        ADD CONSTRAINT "pg-drizzle_deal_contact_deal_id_pg-drizzle_deal_id_fk" 
        FOREIGN KEY ("deal_id") REFERENCES "pg-drizzle_deal"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'pg-drizzle_deal_contact_contact_id_pg-drizzle_contact_id_fk'
    ) THEN
        ALTER TABLE "pg-drizzle_deal_contact" 
        ADD CONSTRAINT "pg-drizzle_deal_contact_contact_id_pg-drizzle_contact_id_fk" 
        FOREIGN KEY ("contact_id") REFERENCES "pg-drizzle_contact"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END $$;

-- Step 4: Migrate existing contactId data to junction table (if contactId column exists)
DO $$ 
DECLARE
    deal_record RECORD;
    contact_uuid TEXT;
BEGIN
    -- Check if contact_id column exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pg-drizzle_deal' 
        AND column_name = 'contact_id'
    ) THEN
        -- Migrate existing data
        FOR deal_record IN 
            SELECT id, contact_id 
            FROM "pg-drizzle_deal" 
            WHERE contact_id IS NOT NULL
        LOOP
            -- Generate UUID for junction table entry
            contact_uuid := gen_random_uuid()::text;
            
            -- Insert into junction table
            INSERT INTO "pg-drizzle_deal_contact" (id, deal_id, contact_id, "createdAt")
            VALUES (contact_uuid, deal_record.id, deal_record.contact_id, now())
            ON CONFLICT DO NOTHING;
        END LOOP;
        
        -- Drop the old contact_id column
        ALTER TABLE "pg-drizzle_deal" DROP COLUMN IF EXISTS "contact_id";
        
        -- Drop the old index if it exists
        DROP INDEX IF EXISTS "deal_contact_idx";
    END IF;
END $$;

