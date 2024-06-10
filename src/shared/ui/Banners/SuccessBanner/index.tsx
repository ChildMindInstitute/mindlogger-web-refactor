import { SUCCESS_BANNER_DURATION } from './lib/const';
import { Banner, BannerProps } from '../Banner';

export const SuccessBanner = ({ children, ...props }: BannerProps) => {
  return (
    <Banner severity="success" duration={SUCCESS_BANNER_DURATION} {...props}>
      {children}
    </Banner>
  );
};
