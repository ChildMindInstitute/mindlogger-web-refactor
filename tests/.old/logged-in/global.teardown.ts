import { test as teardown } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

teardown('deauthenticate', async () => {
    const sessionFilePath = path.join('tests/', '.auth/session.json');
    // Delete the session file if it exists
    if (fs.existsSync(sessionFilePath)) {
    fs.unlinkSync(sessionFilePath);
    console.log(`Deleted session file: ${sessionFilePath}`);
    } else {
    console.log(`Session file not found at: ${sessionFilePath}`);
    }
});