import { act } from '@testing-library/react';

import { useSessionElsewhereGuard } from './useSessionElsewhereGuard';

import { BannerOrder } from '~/entities/banner/model';
import { SESSION_ELSEWHERE_KEY } from '~/shared/utils/session/session.const';
import { renderHookWithProviders } from '~/test/utils';

const markSessionElsewhere = () => sessionStorage.setItem(SESSION_ELSEWHERE_KEY, 'true');

const renderGuard = (isBannerShowing = false) =>
  renderHookWithProviders(() => useSessionElsewhereGuard(), {
    preloadedState: {
      banners: {
        banners: isBannerShowing
          ? [{ key: 'SessionElsewhereBanner' as const, order: BannerOrder.Top }]
          : [],
      },
    },
  });

type Store = ReturnType<typeof renderGuard>['store'];

const bannersIn = (store: Store) => store.getState().banners.banners;

describe('useSessionElsewhereGuard', () => {
  beforeEach(() => sessionStorage.clear());

  it('lets the action through while this browser holds no other session', () => {
    const { result } = renderGuard();

    let wasRefused = true;
    act(() => {
      wasRefused = result.current.refuse();
    });

    expect(wasRefused).toBe(false);
    expect(result.current.isBlocked).toBe(false);
  });

  it('refuses the action while another tab holds the session', () => {
    markSessionElsewhere();
    const { result } = renderGuard();

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
    const { result } = renderGuard();

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

    const { result } = renderGuard();

    expect(result.current.isBlocked).toBe(false);
  });

  // The session can end while the page sits open, and a grey control with no banner reads as broken.
  it('lets a refused control work again once the session elsewhere has ended', () => {
    markSessionElsewhere();
    const { result, rerender } = renderGuard();

    act(() => {
      result.current.refuse();
    });
    sessionStorage.clear();
    rerender();

    expect(result.current.isBlocked).toBe(false);
  });

  // A dismissed message plus a control that quietly stops working reads as the page being broken.
  it('brings the banner back when it has been dismissed', () => {
    markSessionElsewhere();
    const { result, store } = renderGuard();

    act(() => {
      result.current.refuse();
    });

    expect(bannersIn(store)).toHaveLength(1);
    expect(bannersIn(store)[0].key).toBe('SessionElsewhereBanner');
  });

  it('does not stack a second banner on top of the one already showing', () => {
    markSessionElsewhere();
    const { result, store } = renderGuard(true);

    act(() => {
      result.current.refuse();
    });
    act(() => {
      result.current.refuse();
    });

    expect(bannersIn(store)).toHaveLength(1);
  });

  it('raises nothing when the action was allowed through', () => {
    const { result, store } = renderGuard();

    act(() => {
      result.current.refuse();
    });

    expect(bannersIn(store)).toHaveLength(0);
  });
});
