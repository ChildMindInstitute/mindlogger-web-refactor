import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useLanguageList } from './useLanguageList';

import { SupportableLanguage } from '~/app/system/locale/constants';

describe('useLanguageList', () => {
  it('returns one entry per SupportableLanguage value', () => {
    const { result } = renderHook(() => useLanguageList());

    expect(result.current).toHaveLength(Object.keys(SupportableLanguage).length);
  });

  it('exposes all supported languages including Afrikaans, isiXhosa and isiZulu', () => {
    const { result } = renderHook(() => useLanguageList());
    const eventKeys = result.current.map((item) => item.eventKey);

    expect(eventKeys).toEqual([
      SupportableLanguage.English,
      SupportableLanguage.French,
      SupportableLanguage.Greek,
      SupportableLanguage.Spanish,
      SupportableLanguage.Portuguese,
      SupportableLanguage.Afrikaans,
      SupportableLanguage.Xhosa,
      SupportableLanguage.Zulu,
    ]);
  });

  it('uses the lowercased enum key as the label translation path', () => {
    const { result } = renderHook(() => useLanguageList());
    const pathsByKey = Object.fromEntries(
      result.current.map((item) => [item.eventKey, item.localizationPath]),
    );

    expect(pathsByKey[SupportableLanguage.English]).toBe('english');
    expect(pathsByKey[SupportableLanguage.French]).toBe('french');
    expect(pathsByKey[SupportableLanguage.Greek]).toBe('greek');
    expect(pathsByKey[SupportableLanguage.Spanish]).toBe('spanish');
    expect(pathsByKey[SupportableLanguage.Portuguese]).toBe('portuguese');
    expect(pathsByKey[SupportableLanguage.Afrikaans]).toBe('afrikaans');
    expect(pathsByKey[SupportableLanguage.Xhosa]).toBe('xhosa');
    expect(pathsByKey[SupportableLanguage.Zulu]).toBe('zulu');
  });
});
