import { Kysely, Migration, MigrationProvider, Migrator } from 'kysely';

export async function migrateToLatest(
  db: Kysely<any>,
  migrations: Record<string, Migration>,
) {
  class RuntimeMigrationProvider implements MigrationProvider {
    constructor() {}

    async getMigrations(): Promise<Record<string, Migration>> {
      return migrations;
    }
  }

  const migrator = new Migrator({
    db,
    provider: new RuntimeMigrationProvider(),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }
}
