import { useCallback, useEffect, useState } from 'react';

import { Header } from './Header';
import { PageDimension } from './pageDimension';

import getWindowDimensions from '~/shared/utils/getWindowDimensions';
import measureComponentHeight from '~/shared/utils/measureComponentHeight';

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

export const usePDFPageWidth = () => {
  const { width: windowWidth } = useWindowDimensions();
  return Math.min(windowWidth - PageDimension.padding, PageDimension.maxWidth);
};

export const useXScaledDimension = (dimension: number) => {
  const pageWidth = usePDFPageWidth();
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

export const useAvailableBodyHeight = (headerPrefix: string) => {
  const availableWidth = useAvailableBodyWidth();
  const height = useBackgroundHeight();
  const scaledTopPadding = useXScaledDimension(28);
  const scaledBottomPadding = useXScaledDimension(40);
  const [availableHeight, setAvailableHeight] = useState(height);

  const calculateAvailableHeight = useCallback(async () => {
    const headerHeight = await measureComponentHeight(availableWidth, () => (
      <Header>{headerPrefix}</Header>
    ));
    setAvailableHeight(height - headerHeight - 24 - scaledTopPadding - scaledBottomPadding);
  }, [availableWidth, headerPrefix, height, scaledBottomPadding, scaledTopPadding]);

  useEffect(() => {
    void calculateAvailableHeight();
  }, [calculateAvailableHeight]);

  return availableHeight;
};

export const useYScaledDimension = (dimension: number) => {
  const height = useBackgroundHeight();
  return (height / 760) * dimension;
};
