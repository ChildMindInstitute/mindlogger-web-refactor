import { Banner, BannerProps } from '../Banner';
import { SUCCESS_BANNER_DURATION } from './lib/const';

export const SuccessBanner = ({ children, ...props }: BannerProps) => {
  return (
    <Banner severity="success" duration={SUCCESS_BANNER_DURATION} {...props}>
      {children}
    </Banner>
  );
};
