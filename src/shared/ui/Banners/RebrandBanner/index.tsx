import { Trans } from 'react-i18next';

import { Banner, BannerProps } from '../Banner';
import { StyledImg, StyledLink } from './RebrandBanner.styles';

import curiousIcon from '~/assets/curious_icon--white.png';
import { defaultBannersModel } from '~/entities/defaultBanners';
import { useAppDispatch } from '~/shared/utils';

const CURIOUS_REBRAND_URL = 'https://www.gettingcurious.com/rebrand';

interface RebrandBannerProps extends BannerProps {
  bannerScope?: string;
}

export const RebrandBanner = ({
  bannerScope = 'global',
  duration = null,
  onClose,
  ...props
}: RebrandBannerProps) => {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(
      defaultBannersModel.actions.dismissBanner({
        key: bannerScope,
        bannerType: 'RebrandBanner',
      }),
    );
    onClose?.();
  };

  return (
    <Banner
      duration={duration}
      icon={<StyledImg src={curiousIcon} />}
      data-testid="rebrand-banner"
      sx={{
        backgroundColor: '#0b0907',
        color: '#fdfcfc',
        '& .MuiAlert-message': {
          maxWidth: 'none',
        },
        '& .MuiButton-root': {
          color: '#fdfcfc',
        },
      }}
      onClose={handleClose}
      {...props}
    >
      <Trans i18nKey="rebrandBanner">
        <strong>We are rebranding! </strong>
        <>Design updates are on the way—same great app, fresh new look. Curious? </>
        <StyledLink href={CURIOUS_REBRAND_URL} target="_blank">
          Click to learn more.
        </StyledLink>
      </Trans>
    </Banner>
  );
};
