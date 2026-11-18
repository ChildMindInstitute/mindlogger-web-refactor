/* global afterEach, beforeEach, describe, expect, it */
const { spawnSync } = require('node:child_process');
const {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { read, utils } = require('xlsx');

const root = path.resolve(__dirname, '..');
let fixture;
let resources;

const english = {
  translation: {
    nested: {
      missing: 'Log in\n{{name}}',
      empty: 'Log out',
      whitespace: 'Cancel',
      same: 'Actions',
      translated: 'Welcome {{name}}',
      formula: '=SUM(A1:A2)',
    },
    count_one: 'One',
    count_other: 'Many',
  },
};
const french = {
  translation: {
    nested: {
      empty: '',
      whitespace: ' \t',
      same: 'Actions',
      translated: 'Bienvenue {{name}}',
      formula: '=SUM(A1:A2)',
    },
    count_one: 'Un',
    count_other: 'Plusieurs',
    extra: 'Élément supplémentaire',
  },
};
const spanish = {
  translation: {
    nested: {
      empty: '',
      whitespace: 'Cancelar',
      same: 'Actions',
      translated: 'Bienvenido {{name}}',
      formula: 'Suma',
    },
    count_one: 'Uno',
    count_other: 'Muchos',
  },
};

const sourceFile = (language) => path.join(resources, language, 'translation.json');
const reportRoot = () => path.join(fixture, 'translation-reports');
const runReport = () =>
  spawnSync(process.execPath, [path.join(fixture, 'scripts/translations-report.js')], {
    cwd: tmpdir(),
    encoding: 'utf8',
  });

beforeEach(() => {
  fixture = mkdtempSync(path.join(tmpdir(), 'web-translation-report-test-'));
  cpSync(path.join(root, 'scripts'), path.join(fixture, 'scripts'), { recursive: true });
  symlinkSync(path.join(root, 'node_modules'), path.join(fixture, 'node_modules'), 'dir');
  resources = path.join(fixture, 'src/i18n');
  for (const [language, data] of Object.entries({ en: english, fr: french, es: spanish })) {
    mkdirSync(path.join(resources, language), { recursive: true });
    writeFileSync(sourceFile(language), `${JSON.stringify(data, null, 2)}\n`);
  }
});

afterEach(() => {
  rmSync(fixture, { recursive: true, force: true });
});

describe('translation report export', () => {
  it('exports an Excel workbook covering all categories without changing sources', () => {
    const languages = ['en', 'fr', 'es'];
    const before = languages.map((language) => readFileSync(sourceFile(language), 'utf8'));
    const result = runReport();
    expect(result.status, result.stderr).toBe(0);
    expect(languages.map((language) => readFileSync(sourceFile(language), 'utf8'))).toEqual(before);
    const [folder] = readdirSync(reportRoot());
    const output = path.join(reportRoot(), folder);
    expect(readdirSync(output)).toEqual(['translations-report.xlsx']);

    const workbook = read(readFileSync(path.join(output, 'translations-report.xlsx')));
    expect(workbook.SheetNames).toEqual(['Summary', 'Missing', 'Empty', 'Same as English']);
    const rows = (name) => utils.sheet_to_json(workbook.Sheets[name], { header: 1, defval: '' });
    expect(rows('Summary').slice(0, 3)).toEqual([
      ['Language', 'File', 'Missing', 'Empty', 'Same as English', 'Total'],
      ['es', 'es/translation.json', 1, 1, 1, 3],
      ['fr', 'fr/translation.json', 1, 2, 2, 5],
    ]);
    const header = ['Language', 'File', 'Translation key', 'English text', 'Current translation'];
    expect(rows('Missing')).toEqual([
      header,
      ['es', 'es/translation.json', 'translation.nested.missing', 'Log in\n{{name}}', ''],
      ['fr', 'fr/translation.json', 'translation.nested.missing', 'Log in\n{{name}}', ''],
    ]);
    expect(rows('Empty')).toEqual([
      header,
      ['es', 'es/translation.json', 'translation.nested.empty', 'Log out', ''],
      ['fr', 'fr/translation.json', 'translation.nested.empty', 'Log out', ''],
      ['fr', 'fr/translation.json', 'translation.nested.whitespace', 'Cancel', ' \t'],
    ]);
    expect(rows('Same as English')).toEqual([
      header,
      ['es', 'es/translation.json', 'translation.nested.same', 'Actions', 'Actions'],
      ['fr', 'fr/translation.json', 'translation.nested.same', 'Actions', 'Actions'],
      ['fr', 'fr/translation.json', 'translation.nested.formula', '=SUM(A1:A2)', '=SUM(A1:A2)'],
    ]);
    // Formula-like text must stay plain text.
    expect(workbook.Sheets['Same as English'].D4.t).toBe('s');
    expect(workbook.Sheets['Same as English'].D4.f).toBeUndefined();
    for (const name of ['Missing', 'Empty', 'Same as English']) {
      expect(workbook.Sheets[name]['!autofilter'].ref).toBe(`A1:E${rows(name).length}`);
    }
    expect(result.stdout).toContain('fr: 1 missing, 2 empty, 2 same as English');
    expect(result.stdout).toContain(path.join(output, 'translations-report.xlsx'));
  });

  it.each([
    ['invalid JSON', () => writeFileSync(sourceFile('fr'), '{broken')],
    ['no English file', () => rmSync(path.join(resources, 'en'), { recursive: true })],
  ])('fails without exporting when there is %s', (_, breakSources) => {
    breakSources();
    const result = runReport();
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Unable to generate translation report:');
    expect(existsSync(reportRoot())).toBe(false);
  });
});
