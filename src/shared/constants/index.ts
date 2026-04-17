import { Language } from '../utils/types';

export const DEFAULT_LANGUAGE: Language = 'en';

export * from './dateTime';
export * from './theme';
export { default as ROUTES } from './routes';
export * from './environment.variables';
export * from './events';

export const ACCOUNT_PASSWORD_MIN_LENGTH = 10;
export const ACCOUNT_PASSWORD_MIN_CHAR_TYPES = 3;
export const LEGACY_PASSWORD_MIN_LENGTH = 6;
export const DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS = 500;
