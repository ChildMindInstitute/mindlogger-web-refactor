import { useCallback, useEffect, useState } from 'react';

import { PageDimension } from './pageDimension';

import getWindowDimensions from '~/shared/utils/getWindowDimensions';

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  const handleResize = useCallback(() => {
    setWindowDimensions(getWindowDimensions());
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return windowDimensions;
};

export const usePageWidth = () => {
  const { width: windowWidth } = useWindowDimensions();
  return Math.min(windowWidth - PageDimension.padding, PageDimension.maxWidth);
};

export const usePageMaxHeight = () => {
  return 2504;
};

export const useXScaledDimension = (dimension: number) => {
  const pageWidth = usePageWidth();
  return (pageWidth / PageDimension.maxWidth) * dimension;
};

export const useBackgroundWidth = () => {
  return useXScaledDimension(580);
};

export const useBackgroundHeight = () => {
  const width = useBackgroundWidth();
  return (width / 580) * 760;
};

export const useAvailableBodyWidth = () => {
  const width = useBackgroundWidth();
  const scaledRightPadding = useXScaledDimension(40);
  const scaledLeftPadding = useXScaledDimension(36.5);
  return width - scaledRightPadding - scaledLeftPadding;
};

export const useYScaledDimension = (dimension: number) => {
  const height = useBackgroundHeight();
  return (height / 760) * dimension;
};
