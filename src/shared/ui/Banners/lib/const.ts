import { ComponentType } from 'react';

import { SuccessBanner, WarningBanner, ErrorBanner, InfoBanner } from '..';
import { BannerProps } from '../Banner';

import { BannerType } from '~/entities/banner/model';

export const BannerComponents: Record<BannerType, ComponentType<BannerProps>> = {
  SuccessBanner,
  WarningBanner,
  ErrorBanner,
  InfoBanner,
};
