const path = require('node:path');

const { createTranslationWorkbook } = require('./translations/createTranslationWorkbook.js');
const { loadTranslations } = require('./translations/loadTranslations.js');
const { saveTranslationWorkbook } = require('./translations/saveTranslationWorkbook.js');
const { validateTranslations } = require('./translations/validateTranslations.js');

function reportTranslations() {
  if (process.argv.length !== 2) {
    throw new Error('Usage: yarn translations:report');
  }

  const root = path.resolve(__dirname, '..');
  const { targets, resources } = loadTranslations(path.join(root, 'src/i18n'));
  const findings = validateTranslations(resources);
  const { workbook, summary } = createTranslationWorkbook(targets, findings);
  const output = saveTranslationWorkbook(workbook, path.join(root, 'translation-reports'));

  for (const { language, missing, empty, same } of summary) {
    console.log(`${language}: ${missing} missing, ${empty} empty, ${same} same as English`);
  }
  console.log(`\nReport: ${output}`);
  console.log('Source translation files were not changed.');
}

try {
  reportTranslations();
} catch (error) {
  console.error(`Unable to generate translation report: ${error.message}`);
  process.exitCode = 1;
}
