import type { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export default async function globalTeardown(_config: FullConfig) {
  const sessionFile = path.join('tests', '.auth', 'session.json');
  const adminFile = path.join('tests', '.auth', 'admin.json');

  for (const file of [sessionFile, adminFile]) {
    if (fs.existsSync(file)) {
      try {
        fs.unlinkSync(file);
        console.log(`[global.teardown] Deleted: ${file}`);
      } catch (err) {
        console.warn(`[global.teardown] Failed to delete ${file}:`, err);
      }
    } else {
      console.log(`[global.teardown] No file at: ${file}`);
    }
  }
}
