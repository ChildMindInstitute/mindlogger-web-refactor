import { Banner, BannerProps } from '../Banner';

export const InfoBanner = ({ children, ...props }: BannerProps) => {
  return (
    <Banner severity="info" {...props}>
      {children}
    </Banner>
  );
};
