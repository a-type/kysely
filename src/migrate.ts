import {
  Kysely,
  Migration,
  MigrationProvider,
  MigrationResult,
  Migrator,
} from 'kysely';

function getMigrator(db: Kysely<any>, migrations: Record<string, Migration>) {
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
  return migrator;
}

function checkResults({
  error,
  results,
}: {
  error?: unknown;
  results?: MigrationResult[];
}) {
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
    throw error;
  }
}

export async function migrateToLatest(
  db: Kysely<any>,
  migrations: Record<string, Migration>,
) {
  const migrator = getMigrator(db, migrations);

  const res = await migrator.migrateToLatest();

  checkResults(res);
}

export async function migrateTo(
  db: Kysely<any>,
  migrations: Record<string, Migration>,
  target: string,
) {
  const migrator = getMigrator(db, migrations);

  const res = await migrator.migrateTo(target);

  checkResults(res);
}

export async function migrateDown(
  db: Kysely<any>,
  migrations: Record<string, Migration>,
  count: number,
) {
  const migrator = getMigrator(db, migrations);

  for (let i = 0; i < count; i++) {
    const res = await migrator.migrateDown();

    checkResults(res);
  }
}
