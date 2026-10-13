import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "solutions_page_residential_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_page_residential_points_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_page_commercial_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_page_commercial_points_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_page_utility_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_page_utility_points_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_page_applications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_page_applications_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_page_systems_flow" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_page_systems_flow_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_page_systems" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"backup" boolean DEFAULT false
  );
  
  CREATE TABLE "solutions_page_systems_locales" (
  	"name" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"ideal" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_page_package" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_page_package_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "solutions_page_locales" (
  	"title" varchar,
  	"intro" varchar,
  	"residential_title" varchar,
  	"residential_text" varchar,
  	"commercial_title" varchar,
  	"commercial_text" varchar,
  	"utility_title" varchar,
  	"utility_text" varchar,
  	"applications_title" varchar,
  	"applications_body" varchar,
  	"systems_title" varchar,
  	"package_title" varchar,
  	"package_body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "contact_phones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL
  );
  
  CREATE TABLE "contact" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"whatsapp" varchar,
  	"email" varchar,
  	"map_link" varchar,
  	"map_pin" varchar,
  	"facebook" varchar,
  	"instagram" varchar,
  	"linkedin" varchar,
  	"youtube" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_locales" (
  	"hours" varchar,
  	"address" varchar,
  	"page_title" varchar,
  	"page_intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "solutions_page_residential_points" ADD CONSTRAINT "solutions_page_residential_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_page_residential_points_locales" ADD CONSTRAINT "solutions_page_residential_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_page_residential_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_page_commercial_points" ADD CONSTRAINT "solutions_page_commercial_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_page_commercial_points_locales" ADD CONSTRAINT "solutions_page_commercial_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_page_commercial_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_page_utility_points" ADD CONSTRAINT "solutions_page_utility_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_page_utility_points_locales" ADD CONSTRAINT "solutions_page_utility_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_page_utility_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_page_applications" ADD CONSTRAINT "solutions_page_applications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_page_applications_locales" ADD CONSTRAINT "solutions_page_applications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_page_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_page_systems_flow" ADD CONSTRAINT "solutions_page_systems_flow_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_page_systems"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_page_systems_flow_locales" ADD CONSTRAINT "solutions_page_systems_flow_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_page_systems_flow"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_page_systems" ADD CONSTRAINT "solutions_page_systems_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_page_systems_locales" ADD CONSTRAINT "solutions_page_systems_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_page_systems"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_page_package" ADD CONSTRAINT "solutions_page_package_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_page_package_locales" ADD CONSTRAINT "solutions_page_package_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_page_package"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_page_locales" ADD CONSTRAINT "solutions_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_phones" ADD CONSTRAINT "contact_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_locales" ADD CONSTRAINT "contact_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "solutions_page_residential_points_order_idx" ON "solutions_page_residential_points" USING btree ("_order");
  CREATE INDEX "solutions_page_residential_points_parent_id_idx" ON "solutions_page_residential_points" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_page_residential_points_locales_locale_parent_id_u" ON "solutions_page_residential_points_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_page_commercial_points_order_idx" ON "solutions_page_commercial_points" USING btree ("_order");
  CREATE INDEX "solutions_page_commercial_points_parent_id_idx" ON "solutions_page_commercial_points" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_page_commercial_points_locales_locale_parent_id_un" ON "solutions_page_commercial_points_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_page_utility_points_order_idx" ON "solutions_page_utility_points" USING btree ("_order");
  CREATE INDEX "solutions_page_utility_points_parent_id_idx" ON "solutions_page_utility_points" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_page_utility_points_locales_locale_parent_id_uniqu" ON "solutions_page_utility_points_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_page_applications_order_idx" ON "solutions_page_applications" USING btree ("_order");
  CREATE INDEX "solutions_page_applications_parent_id_idx" ON "solutions_page_applications" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_page_applications_locales_locale_parent_id_unique" ON "solutions_page_applications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_page_systems_flow_order_idx" ON "solutions_page_systems_flow" USING btree ("_order");
  CREATE INDEX "solutions_page_systems_flow_parent_id_idx" ON "solutions_page_systems_flow" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_page_systems_flow_locales_locale_parent_id_unique" ON "solutions_page_systems_flow_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_page_systems_order_idx" ON "solutions_page_systems" USING btree ("_order");
  CREATE INDEX "solutions_page_systems_parent_id_idx" ON "solutions_page_systems" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_page_systems_locales_locale_parent_id_unique" ON "solutions_page_systems_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_page_package_order_idx" ON "solutions_page_package" USING btree ("_order");
  CREATE INDEX "solutions_page_package_parent_id_idx" ON "solutions_page_package" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_page_package_locales_locale_parent_id_unique" ON "solutions_page_package_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "solutions_page_locales_locale_parent_id_unique" ON "solutions_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "contact_phones_order_idx" ON "contact_phones" USING btree ("_order");
  CREATE INDEX "contact_phones_parent_id_idx" ON "contact_phones" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "contact_locales_locale_parent_id_unique" ON "contact_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "solutions_page_residential_points" CASCADE;
  DROP TABLE "solutions_page_residential_points_locales" CASCADE;
  DROP TABLE "solutions_page_commercial_points" CASCADE;
  DROP TABLE "solutions_page_commercial_points_locales" CASCADE;
  DROP TABLE "solutions_page_utility_points" CASCADE;
  DROP TABLE "solutions_page_utility_points_locales" CASCADE;
  DROP TABLE "solutions_page_applications" CASCADE;
  DROP TABLE "solutions_page_applications_locales" CASCADE;
  DROP TABLE "solutions_page_systems_flow" CASCADE;
  DROP TABLE "solutions_page_systems_flow_locales" CASCADE;
  DROP TABLE "solutions_page_systems" CASCADE;
  DROP TABLE "solutions_page_systems_locales" CASCADE;
  DROP TABLE "solutions_page_package" CASCADE;
  DROP TABLE "solutions_page_package_locales" CASCADE;
  DROP TABLE "solutions_page" CASCADE;
  DROP TABLE "solutions_page_locales" CASCADE;
  DROP TABLE "contact_phones" CASCADE;
  DROP TABLE "contact" CASCADE;
  DROP TABLE "contact_locales" CASCADE;`)
}
