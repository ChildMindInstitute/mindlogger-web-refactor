const { readFileSync, readdirSync } = require('node:fs');
const path = require('node:path');

function loadTranslations(directory) {
  const readTranslation = (file) => {
    const translations = JSON.parse(readFileSync(path.join(directory, file), 'utf8'));
    if (!translations || typeof translations !== 'object' || Array.isArray(translations)) {
      throw new Error(`${file} must contain a translation object.`);
    }

    return translations;
  };
  // Each language folder holds a single translation.json.
  const targets = readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== 'en')
    .map((entry) => entry.name)
    .sort()
    .map((language) => {
      const file = `${language}/translation.json`;

      return { file, language, translations: readTranslation(file) };
    });
  const resources = {
    en: readTranslation('en/translation.json'),
    ...Object.fromEntries(targets.map(({ language, translations }) => [language, translations])),
  };

  return { targets, resources };
}

module.exports = { loadTranslations };
