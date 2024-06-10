import { Banner, BannerProps } from '../Banner';

export const WarningBanner = ({ children, ...props }: BannerProps) => {
  return (
    <Banner severity="warning" {...props}>
      {children}
    </Banner>
  );
};
