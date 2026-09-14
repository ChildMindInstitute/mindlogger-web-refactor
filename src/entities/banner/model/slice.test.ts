import { actions, reducer } from './slice';
import { BannerOrder } from './types';

const add = (children: string) =>
  actions.addBanner({ key: 'ErrorBanner', bannerProps: { children }, order: BannerOrder.Default });

describe('banners slice', () => {
  it('keeps one banner per key, with the latest content', () => {
    const state = [add('first'), add('second')].reduce(reducer, { banners: [] });

    expect(state.banners).toEqual([
      { key: 'ErrorBanner', bannerProps: { children: 'second' }, order: BannerOrder.Default },
    ]);
  });

  it('leaves banners with other keys alone', () => {
    const info = actions.addBanner({ key: 'InfoBanner', order: BannerOrder.Top });

    const state = [info, add('first'), add('second')].reduce(reducer, { banners: [] });

    expect(state.banners.map(({ key }) => key)).toEqual(['InfoBanner', 'ErrorBanner']);
  });
});
