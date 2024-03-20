import i18next from 'i18next';

export const getLanguage = (): string => i18next.language || window.localStorage.i18nextLng;
