import { act } from '@testing-library/react';

import { useSoftLockBanner } from './useSoftLockBanner';

import { getSessionReturn, setSessionReturn } from '~/shared/utils/session/sessionReturn';
import { renderHookWithProviders } from '~/test/utils';

const RECORD = { path: '/protected/profile', userId: 'user-1', email: 'a@example.com' };

const renderBanner = () => renderHookWithProviders(useSoftLockBanner, {});

const bannersIn = (store: ReturnType<typeof renderBanner>['store']) =>
  store.getState().banners.banners;

describe('useSoftLockBanner', () => {
  beforeEach(() => sessionStorage.clear());

  it('says nothing on a login page nobody was thrown out onto', () => {
    const { result, store } = renderBanner();

    expect(bannersIn(store)).toEqual([]);
    expect(result.current.softLockEmail).toBe('');
  });

  it('explains a session that ended on its own, and offers the email back', () => {
    setSessionReturn(RECORD);

    const { result, store } = renderBanner();

    expect(bannersIn(store).map(({ key }) => key)).toEqual(['SoftLockWarningBanner']);
    expect(result.current.softLockEmail).toBe('a@example.com');
  });

  // Heading for a password reset or a new account is not resuming, so the page is not held open.
  it('withdraws the offer once the user heads somewhere else', () => {
    setSessionReturn(RECORD);
    const { result, store } = renderBanner();

    act(() => result.current.dismiss());

    expect(bannersIn(store)).toEqual([]);
    expect(getSessionReturn()).toBeNull();
  });

  // Otherwise the field the user is about to type into empties as the banner goes.
  it('keeps the email it already handed out after a dismissal', () => {
    setSessionReturn(RECORD);
    const { result } = renderBanner();

    act(() => result.current.dismiss());

    expect(result.current.softLockEmail).toBe('a@example.com');
  });
});
