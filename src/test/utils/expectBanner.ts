import appStore from '~/app/store';
import { BannerType } from '~/entities/banner/model';

/**
 * Jest utility to determine if the banner having the given key has been rendered
 * based on the current state of Redux store.
 */
export const expectBanner = (store: typeof appStore, key: BannerType, expectPresence = true) => {
  const expectation = expect(
    store.getState().banners.banners.find((payload) => payload.key === key),
  );

  const matcher = expectPresence ? expectation : expectation.not;
  matcher.toBeDefined();
};
