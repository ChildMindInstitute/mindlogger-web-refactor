import { Banner, BannerProps } from '../Banner';

export const ErrorBanner = ({ children, ...props }: BannerProps) => {
  return (
    <Banner severity="error" {...props}>
      {children}
    </Banner>
  );
};
