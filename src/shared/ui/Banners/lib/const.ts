import { ComponentType } from 'react';

import { BannerProps } from '../Banner';

import { BannerType } from '~/entities/banner/model';
import { ROUTES } from '~/shared/constants';
import { AnnouncementBanner } from '~/shared/ui/Banners/AnnouncementBanner';
import { ErrorBanner } from '~/shared/ui/Banners/ErrorBanner';
import { InfoBanner } from '~/shared/ui/Banners/InfoBanner';
import { SuccessBanner } from '~/shared/ui/Banners/SuccessBanner';
import { WarningBanner } from '~/shared/ui/Banners/WarningBanner';

export const BannerComponents: Record<BannerType, ComponentType<BannerProps>> = {
  SuccessBanner,
  WarningBanner,
  ErrorBanner,
  InfoBanner,
  AnnouncementBanner,
};

export const ANNOUNCEMENT_BANNER_EXCLUDED_ROUTES = [
  ROUTES.survey.path,
  ROUTES.publicSurvey.path,
  ROUTES.autoCompletion.path,
  ROUTES.publicAutoCompletion.path,
  ROUTES.activeAssessment.path,
];
