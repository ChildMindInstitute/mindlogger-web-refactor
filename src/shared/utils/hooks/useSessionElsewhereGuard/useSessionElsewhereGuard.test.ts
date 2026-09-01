import { act, renderHook } from '@testing-library/react';

import { useSessionElsewhereGuard } from './useSessionElsewhereGuard';

import { SESSION_ELSEWHERE_KEY } from '~/shared/utils/session/session.const';

const markSessionElsewhere = () => sessionStorage.setItem(SESSION_ELSEWHERE_KEY, 'true');

describe('useSessionElsewhereGuard', () => {
  beforeEach(() => sessionStorage.clear());

  it('lets the action through while this browser holds no other session', () => {
    const { result } = renderHook(() => useSessionElsewhereGuard());

    let wasRefused = true;
    act(() => {
      wasRefused = result.current.refuse();
    });

    expect(wasRefused).toBe(false);
    expect(result.current.isBlocked).toBe(false);
  });

  it('refuses the action while another tab holds the session', () => {
    markSessionElsewhere();
    const { result } = renderHook(() => useSessionElsewhereGuard());

    let wasRefused = false;
    act(() => {
      wasRefused = result.current.refuse();
    });

    expect(wasRefused).toBe(true);
    expect(result.current.isBlocked).toBe(true);
  });

  // Nothing on the page works from here on: the way forward is a reload, not another press.
  it('stays blocked once it has refused', () => {
    markSessionElsewhere();
    const { result } = renderHook(() => useSessionElsewhereGuard());

    act(() => {
      result.current.refuse();
    });
    act(() => {
      result.current.refuse();
    });

    expect(result.current.isBlocked).toBe(true);
  });

  // Nothing is refused until something is actually pressed, so the page looks normal on arrival.
  it('starts unblocked even when another tab holds the session', () => {
    markSessionElsewhere();

    const { result } = renderHook(() => useSessionElsewhereGuard());

    expect(result.current.isBlocked).toBe(false);
  });
});
