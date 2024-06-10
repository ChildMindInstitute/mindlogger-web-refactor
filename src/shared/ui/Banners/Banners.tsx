import { Collapse } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';

import { BannerComponents } from './lib/const';

import { BannerPayload, BannerType, useBanners } from '~/entities/banner/model';

const handlePureClose = (
  removeBanner: (key: BannerType) => void,
  { key, bannerProps }: BannerPayload,
) => {
  removeBanner(key);
  bannerProps?.onClose?.();
};

export const Banners = () => {
  const { banners, removeBanner } = useBanners();

  return (
    <TransitionGroup>
      {banners.map(({ key, bannerProps }) => {
        const BannerComponent = BannerComponents[key];

        return (
          <Collapse key={key}>
            <BannerComponent
              {...bannerProps}
              onClose={() => handlePureClose(removeBanner, { key, bannerProps })}
            />
          </Collapse>
        );
      })}
    </TransitionGroup>
  );
};
