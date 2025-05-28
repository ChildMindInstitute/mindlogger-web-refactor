import { ComponentType } from 'react';

import { BannerProps } from '../Banner';

import { BannerType } from '~/entities/banner/model';
import { ErrorBanner } from '~/shared/ui/Banners/ErrorBanner';
import { InfoBanner } from '~/shared/ui/Banners/InfoBanner';
import { RebrandBanner } from '~/shared/ui/Banners/RebrandBanner';
import { SuccessBanner } from '~/shared/ui/Banners/SuccessBanner';
import { WarningBanner } from '~/shared/ui/Banners/WarningBanner';

export const BannerComponents: Record<BannerType, ComponentType<BannerProps>> = {
  SuccessBanner,
  WarningBanner,
  ErrorBanner,
  InfoBanner,
  RebrandBanner,
};
