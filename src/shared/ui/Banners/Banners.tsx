import { Collapse } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';

import { BannerComponents } from './lib/const';

import { BannerPayload, BannerType, bannersSelector, useBanners } from '~/entities/banner/model';
import { useAppSelector } from '~/shared/utils';

const handlePureClose = (
  removeBanner: (key: BannerType) => void,
  { key, bannerProps }: Omit<BannerPayload, 'order'>,
) => {
  removeBanner(key);
  bannerProps?.onClose?.();
};

export const Banners = () => {
  const { removeBanner } = useBanners();
  const banners = useAppSelector(bannersSelector);

  const sortedBanners = [...banners].sort((a, b) => a.order - b.order);

  return (
    <TransitionGroup>
      {sortedBanners.map(({ key, bannerProps }) => {
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
