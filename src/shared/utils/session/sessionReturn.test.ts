import { SESSION_RETURN_KEY } from './session.const';
import {
  clearSessionReturn,
  getSessionReturn,
  getSessionReturnPath,
  setSessionReturn,
} from './sessionReturn';

const RECORD = { path: '/protected/profile', userId: 'user-1', email: 'a@example.com' };

describe('sessionReturn', () => {
  beforeEach(() => sessionStorage.clear());

  it('keeps the page a session ended on, and who it belonged to', () => {
    setSessionReturn(RECORD);

    expect(getSessionReturn()).toEqual(RECORD);
    expect(getSessionReturnPath('user-1')).toBe('/protected/profile');
  });

  // The whole point of naming the user: a shared machine must not hand one person another's page.
  it('offers the page back to nobody but the user it belonged to', () => {
    setSessionReturn(RECORD);

    expect(getSessionReturnPath('user-2')).toBeNull();
  });

  it.each([
    ['nothing was recorded', null],
    ['the record cannot be read', 'not-json'],
  ])('offers no page when %s', (_label, stored) => {
    if (stored !== null) sessionStorage.setItem(SESSION_RETURN_KEY, stored);

    expect(getSessionReturn()).toBeNull();
    expect(getSessionReturnPath('user-1')).toBeNull();
  });

  // A tab that has never signed anyone in reads an empty id, which must not match a stored one.
  it('offers no page to an unnamed user', () => {
    setSessionReturn({ ...RECORD, userId: '' });

    expect(getSessionReturnPath('')).toBeNull();
  });

  it('forgets the page once it has been cleared', () => {
    setSessionReturn(RECORD);

    clearSessionReturn();

    expect(getSessionReturn()).toBeNull();
  });
});
