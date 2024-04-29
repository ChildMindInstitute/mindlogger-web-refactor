import { Box } from '~/shared/ui';

type SplashScreenItemProps = {
  imageSrc: string;
};

export const SplashScreenItem = ({ imageSrc }: SplashScreenItemProps) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="90%"
      margin="auto"
      data-testid="splash-screen-item"
    >
      <img src={imageSrc} style={{ maxWidth: '100%' }} />
    </Box>
  );
};
