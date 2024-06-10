import { BannerProps } from '~/shared/ui/Banners/Banner';

export const Banners = ['SuccessBanner', 'ErrorBanner', 'WarningBanner', 'InfoBanner'] as const;
export type BannerType = (typeof Banners)[number];

export type BannerPayload = {
  key: BannerType;
  bannerProps?: BannerProps;
};
