import { PropsWithChildren } from 'react';

import { Outlet } from 'react-router-dom';

import { Theme } from '~/shared/constants';
import { NotificationCenter } from '~/shared/ui';
import { Box } from '~/shared/ui';
import Footer from '~/widgets/Footer';
import Header from '~/widgets/Header';

type LayoutProps = PropsWithChildren<{
  bgColor?: string;

  header?: React.ReactNode | undefined;
  footer?: React.ReactNode | undefined;
  onKeyDownHandler?: (key: string) => void;
}>;

const Layout = ({
  bgColor = Theme.colors.light.surface1,
  footer,
  header,
  onKeyDownHandler,
  children,
}: LayoutProps): null | JSX.Element => {
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
      {header ? header : <Header />}
      <Box
        id="app-content-container"
        display="flex"
        flex={1}
        flexDirection="column"
        overflow="auto"
      >
        <NotificationCenter />
        {children ? children : <Outlet />}
        {footer ? footer : <Footer />}
      </Box>
    </Box>
  );
};

export default Layout;
