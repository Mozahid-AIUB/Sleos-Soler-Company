import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_measurement_forms_status" AS ENUM('new', 'contacted', 'done');
  CREATE TABLE "measurement_forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_measurement_forms_status" DEFAULT 'new' NOT NULL,
  	"note" varchar,
  	"title" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"company" varchar,
  	"location" varchar,
  	"project_type" varchar,
  	"lang" varchar,
  	"answers" jsonb,
  	"files_refused" numeric DEFAULT 0,
  	"pdf_id" integer,
  	"has_form_page" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lead_files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "measurement_forms_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "lead_files_id" integer;
  ALTER TABLE "measurement_forms" ADD CONSTRAINT "measurement_forms_pdf_id_lead_files_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."lead_files"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "measurement_forms_pdf_idx" ON "measurement_forms" USING btree ("pdf_id");
  CREATE INDEX "measurement_forms_updated_at_idx" ON "measurement_forms" USING btree ("updated_at");
  CREATE INDEX "measurement_forms_created_at_idx" ON "measurement_forms" USING btree ("created_at");
  CREATE INDEX "lead_files_updated_at_idx" ON "lead_files" USING btree ("updated_at");
  CREATE INDEX "lead_files_created_at_idx" ON "lead_files" USING btree ("created_at");
  CREATE UNIQUE INDEX "lead_files_filename_idx" ON "lead_files" USING btree ("filename");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_measurement_forms_fk" FOREIGN KEY ("measurement_forms_id") REFERENCES "public"."measurement_forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lead_files_fk" FOREIGN KEY ("lead_files_id") REFERENCES "public"."lead_files"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_measurement_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("measurement_forms_id");
  CREATE INDEX "payload_locked_documents_rels_lead_files_id_idx" ON "payload_locked_documents_rels" USING btree ("lead_files_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "measurement_forms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lead_files" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "measurement_forms" CASCADE;
  DROP TABLE "lead_files" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_measurement_forms_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_lead_files_fk";
  
  DROP INDEX "payload_locked_documents_rels_measurement_forms_id_idx";
  DROP INDEX "payload_locked_documents_rels_lead_files_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "measurement_forms_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "lead_files_id";
  DROP TYPE "public"."enum_measurement_forms_status";`)
}
