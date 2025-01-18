import fs from 'fs';
import path from 'path';
import Store from '../store';
import Logger from '../utils/logger';

export default async function runMigrations() {
  const store = Store.getInstance().getDatabase(); 

  try {
    const migrationFiles = fs
      .readdirSync(__dirname)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      Logger("INFO", "MIGRATOR", `Executing migration: ${file}`);

      const sql = fs.readFileSync(path.join(__dirname, file), 'utf-8');
      await store.unsafe(sql);

      Logger("INFO", "MIGRATOR", `Executed migration: ${file}`);
    }

    Logger("INFO", "MIGRATOR", "All migrations executed successfully");
  } catch (error: any) {
    Logger("ERROR", "MIGRATOR", error.message);
  }
}