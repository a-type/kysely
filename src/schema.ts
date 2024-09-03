import { sql, ColumnDefinitionBuilder } from 'kysely';

export const sqliteNow = (col: ColumnDefinitionBuilder) =>
	col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`);
