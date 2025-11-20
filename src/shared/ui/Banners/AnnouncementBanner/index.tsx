import { Trans } from 'react-i18next';

import { Banner, BannerProps } from '../Banner';
import { StyledImg, StyledLink } from './AnnouncementBanner.styles';

import curiousIcon from '~/assets/curious_icon--white.png';
import { defaultBannersModel } from '~/entities/defaultBanners';
import { useAppDispatch } from '~/shared/utils';

const ANNOUNCEMENT_URL = 'https://www.gettingcurious.com/rebrand';

interface AnnouncementBannerProps extends BannerProps {
  bannerScope?: string;
}

export const AnnouncementBanner = ({
  bannerScope = 'global',
  duration = null,
  onClose,
  ...props
}: AnnouncementBannerProps) => {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(
      defaultBannersModel.actions.dismissBanner({
        key: bannerScope,
        bannerType: 'AnnouncementBanner',
      }),
    );
    onClose?.();
  };

  return (
    <Banner
      duration={duration}
      icon={<StyledImg src={curiousIcon} />}
      data-testid="announcement-banner"
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
      <Trans i18nKey="announcementBanner">
        <strong>We are rebranding! </strong>
        <>Design updates are on the way—same great app, fresh new look. Curious? </>
        <StyledLink href={ANNOUNCEMENT_URL} target="_blank">
          Click to learn more.
        </StyledLink>
      </Trans>
    </Banner>
  );
};
