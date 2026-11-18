/* global describe, it, expect */
const { validateTranslations } = require('./validateTranslations.js');

describe('validateTranslations', () => {
  it('reports missing, blank, and exactly matching nested translations', () => {
    expect(
      validateTranslations({
        en: {
          translation: {
            login: 'Log in',
            logout: 'Log out',
            save: 'Save',
            cancel: 'Cancel',
            back: 'Back',
            recovery: { title: 'Recover account' },
          },
        },
        fr: {
          translation: {
            logout: '',
            save: 'Save',
            cancel: ' \t\n',
            back: 'back',
            extra: 'Extra',
          },
        },
      }),
    ).toEqual([
      { type: 'missing-key', language: 'fr', key: 'translation.login', englishValue: 'Log in' },
      { type: 'empty-value', language: 'fr', key: 'translation.logout', englishValue: 'Log out' },
      { type: 'same-as-reference', language: 'fr', key: 'translation.save', englishValue: 'Save' },
      { type: 'empty-value', language: 'fr', key: 'translation.cancel', englishValue: 'Cancel' },
      {
        type: 'missing-key',
        language: 'fr',
        key: 'translation.recovery.title',
        englishValue: 'Recover account',
      },
    ]);
  });

  it('reports non-string translations as missing', () => {
    expect(validateTranslations({ en: { save: 'Save' }, fr: { save: null } })).toEqual([
      { type: 'missing-key', language: 'fr', key: 'save', englishValue: 'Save' },
    ]);
  });

  it('rejects a missing English reference', () => {
    expect(() => validateTranslations({ fr: { save: 'Enregistrer' } })).toThrow(
      'English translations are required for comparison.',
    );
  });
});
