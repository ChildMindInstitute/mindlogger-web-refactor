import React, { useEffect, useState } from 'react';

import { measureComponentHeight } from '~/pages/ActionPlan/component-utils';
import { Header } from '~/pages/ActionPlan/components/Header';
import { PageDimensions } from '~/pages/ActionPlan/constants';
import { getWindowDimensions } from '~/pages/ActionPlan/utils';

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

export function usePDFPageWidth() {
  const { width: windowWidth } = useWindowDimensions();
  const windowWidthMinusPadding = windowWidth - PageDimensions.padding;

  return Math.min(windowWidthMinusPadding, PageDimensions.maxWidth);
}

export function useXScaledDimension(dimension: number) {
  const pageWidth = usePDFPageWidth();

  return (pageWidth / PageDimensions.maxWidth) * dimension;
}

export function useBackgroundWidth() {
  return useXScaledDimension(580);
}

export function useBackgroundHeight() {
  const width = useBackgroundWidth();

  return (width / 580) * 760;
}

export function useAvailableBodyWidth() {
  const width = useBackgroundWidth();
  const scaledRightPadding = useXScaledDimension(40);
  const scaledLeftPadding = useXScaledDimension(36.5);

  return width - scaledRightPadding - scaledLeftPadding;
}

export function useAvailableBodyHeight(headerPrefix: string) {
  const availableWidth = useAvailableBodyWidth();
  const height = useBackgroundHeight();
  const scaledTopPadding = useXScaledDimension(28);
  const scaledBottomPadding = useXScaledDimension(40);

  const [availableHeight, setAvailableHeight] = useState(height);

  useEffect(() => {
    const f = async () => {
      const headerHeight =
        (await measureComponentHeight(availableWidth, () => <Header>{headerPrefix}</Header>)) + 24;

      const _availableHeight = height - headerHeight - scaledTopPadding - scaledBottomPadding;

      setAvailableHeight(_availableHeight);
    };

    void f();
  }, [availableWidth, headerPrefix, height, scaledBottomPadding, scaledTopPadding]);

  return availableHeight;
}

export function useYScaledDimension(dimension: number) {
  const height = useBackgroundHeight();

  return (height / 760) * dimension;
}
