import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "solutions_page_residential_points_locales" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "solutions_page_commercial_points_locales" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "solutions_page_utility_points_locales" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "solutions_page_applications_locales" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "solutions_page_applications_locales" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "solutions_page_systems_flow_locales" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "solutions_page_systems_locales" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "solutions_page_systems_locales" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "solutions_page_systems_locales" ALTER COLUMN "ideal" DROP NOT NULL;
  ALTER TABLE "solutions_page_package_locales" ALTER COLUMN "text" DROP NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "solutions_page_residential_points_locales" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "solutions_page_commercial_points_locales" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "solutions_page_utility_points_locales" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "solutions_page_applications_locales" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "solutions_page_applications_locales" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "solutions_page_systems_flow_locales" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "solutions_page_systems_locales" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "solutions_page_systems_locales" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "solutions_page_systems_locales" ALTER COLUMN "ideal" SET NOT NULL;
  ALTER TABLE "solutions_page_package_locales" ALTER COLUMN "text" SET NOT NULL;`)
}
