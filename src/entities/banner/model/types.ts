import { BannerProps } from '~/shared/ui/Banners/Banner';

export const Banners = [
  'SuccessBanner',
  'ErrorBanner',
  'WarningBanner',
  'InfoBanner',
  'RebrandBanner',
] as const;
export type BannerType = (typeof Banners)[number];

export enum BannerOrder {
  Top = 0,
  Default = 1,
  Bottom = 2,
}

export type BannerPayload = {
  key: BannerType;
  bannerProps?: BannerProps;
  order: BannerOrder;
};
