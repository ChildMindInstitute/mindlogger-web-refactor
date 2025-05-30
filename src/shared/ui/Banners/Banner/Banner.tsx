import { useEffect, useState } from 'react';

import { Alert } from '@mui/material';

import { BANNER_ICONS } from './lib/const';
import { BannerProps } from './lib/types';

import { Markdown } from '~/shared/ui/Markdown';
import Text from '~/shared/ui/Text';
import { useWindowFocus } from '~/shared/utils';

export const Banner = ({
  children,
  duration = 5000,
  onClose,
  hasCloseButton = !!onClose,
  severity = 'success',
  icon,
  ...rest
}: BannerProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const isWindowFocused = useWindowFocus();

  // Close banner on timeout only while window is focused & banner not hovered
  // (a11y behavior adapted from MUI SnackBar)
  useEffect(() => {
    if (!duration || !onClose || isHovering || !isWindowFocused) return;

    const timeoutId = setTimeout(onClose, duration);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [duration, isHovering, isWindowFocused, onClose]);

  return (
    <Alert
      iconMapping={BANNER_ICONS}
      icon={icon}
      onClose={hasCloseButton ? onClose : undefined}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      severity={severity}
      data-testid={`${severity}-banner`}
      {...rest}
    >
      <Text>{typeof children === 'string' ? <Markdown markdown={children} /> : children}</Text>
    </Alert>
  );
};
