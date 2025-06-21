import { PropsWithChildren } from 'react';

import { Outlet } from 'react-router-dom';

import { variables } from '~/shared/constants/theme/variables';
import { Banners, Box } from '~/shared/ui';

type Props = PropsWithChildren<{
  bgColor?: string;

  header?: React.ReactNode | undefined;
  footer?: React.ReactNode | undefined;
  onKeyDownHandler?: (key: string) => void;
  showBanners?: boolean;
}>;

const Layout = ({
  bgColor = variables.palette.surface1,
  footer,
  header,
  onKeyDownHandler,
  showBanners = true,
  children,
}: Props): null | JSX.Element => {
  return (
    <Box
      id="app-main-layout"
      display="flex"
      flex={1}
      flexDirection="column"
      onKeyDown={(event) => onKeyDownHandler && onKeyDownHandler(event.key)}
      sx={{
        backgroundColor: bgColor,
      }}
    >
      {header && header}
      <Box
        id="app-content-container"
        display="flex"
        flex={1}
        flexDirection="column"
        overflow="auto"
      >
        {showBanners && <Banners />}
        {children ? children : <Outlet />}
        {footer && footer}
      </Box>
    </Box>
  );
};

export default Layout;
