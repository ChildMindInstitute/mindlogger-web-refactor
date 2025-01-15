import React, { ComponentProps } from 'react';

import { PageComponent, PageRenderer } from './Document.type';
import { Page } from './Page';
import { deepDivideComponents, getFlatComponentIndices } from './pageComponent';

import measureComponentHeight from '~/shared/utils/measureComponentHeight';

export const pageRenderer =
  (
    availableWidth: number,
    pageProps: Omit<ComponentProps<typeof Page>, 'pageNumber' | 'pageComponents'>,
  ): PageRenderer =>
  async (pageNumber, components, flatIndices, inclusivePivot) => {
    const [renderComponents, restComponents] = deepDivideComponents(
      components,
      flatIndices,
      inclusivePivot,
    );

    const page = (
      <Page
        {...pageProps}
        key={`page-${pageNumber}`}
        pageNumber={pageNumber}
        pageComponents={renderComponents}
      />
    );

    const pageHeight = await measureComponentHeight(availableWidth, page);

    return { page, pageHeight, restComponents };
  };

export const pagesRenderer = (renderPage: PageRenderer, pageMaxHeight: number) => {
  const renderPages = async (
    pageNumber: number,
    components: PageComponent[],
  ): Promise<React.ReactNode[]> => {
    // Short-circuit if there is nothing to render.
    if (components.length <= 0) {
      return [];
    }

    // Generate a flattened list of `[component-index, content-index]` tuples from the input
    // components list. This way, we can perform binary search on the flattened list of tuples,
    // which is a lot less complicated to do then the alternative, which is to first iterate over
    // the top level component indices then the nested content indices.
    const flatIndices = getFlatComponentIndices(components);

    // Binary search has a worst case scenario of `Log2(N)` iterations. So we can use that value
    // as a loop limiter to prevent infinite loop. This works out to be about 7 per 100 items.
    // The `x 2` part is just in case I didn't implement the algorithm quite properly, and it
    // ends up being less efficient.
    const loopLimit = Math.ceil(Math.log2(flatIndices.length)) * 2;

    let loopCount = 0;
    /**
     * Render a page containing a truncated list of components. The truncation point is determine
     * by the midpoint of the given `range` parameter. This function will recursively use a
     * binary search algorithm to render a page with the largest possible number of contents.
     * @param range Use to calculate a midpoint (i.e. the pivot). And the page would render
     * components and contents up to and including pivot index.
     * @param prevRange Keep track of the previously used range. This is used during backtracking
     * to discard a range that caused the page to be too long.
     * @param isBacktrack Indicates if the function is currently backtracking or not.
     * Backtracking happens when a page is too short, but the new range caused the page to be
     * too long. In this case, we'll just have to backtrack and accept the previous range.
     */
    const renderTruncatedPage = async (
      range: [number, number] | null,
      prevRange: [number, number] | null,
      isBacktrack: boolean,
    ): Promise<[React.ReactNode, PageComponent[]]> => {
      // If the search window is missing (which should only happen during the very first rendering
      // cycle of a page), then use the entire indices range as the search window.
      if (range === null) {
        range = [0, flatIndices.length - 1];
      }

      // Find the midpoint of the search window, and render a page containing components up to and
      // including the component at the midpoint index.
      const pivot = Math.floor(range[0] + (range[1] - range[0]) / 2);
      const { page, pageHeight, restComponents } = await renderPage(
        pageNumber,
        components,
        flatIndices,
        pivot,
      );

      loopCount += 1;
      if (loopCount > loopLimit) {
        // *** Loop overflow ***
        // This condition should in theory never happen, as the loop limiter is greater than the
        // theoretical upper bound of binary search's worst case scenario iteration count.
        // But if it does happen for whatever reason, we just have to accept the page as it was
        // rendered, and move on.
        return [page, restComponents];
      }

      if (isBacktrack) {
        // *** Backtrack Hit ***
        // This is a special case where regardless of the size of the search window, the page
        // will be accepted. This can only happen at most once per page. And would happen when
        // the page was previously rendered as being too small, but was then re-rendered as being
        // too large.
        return [page, restComponents];
      } else {
        if (range[0] === range[1]) {
          if (pageHeight <= pageMaxHeight) {
            // *** Underflow Hit ***
            // This happens when the page was rendered as smaller than the max size, but the
            // search window is already too small for further adjustments. In this case, the page
            // will be accepted as it was rendered.
            return [page, restComponents];
          } else {
            // *** Overflow Hit ***
            // This happens when the page was rendered as larger than the max size, but the
            // search window is already too small for further adjustments. In this case, one
            // additional "backtrack" rendering cycle will happen to re-create and accept the
            // page with the previously used search window.
            return await renderTruncatedPage(prevRange, null, true);
          }
        } else {
          if (pageHeight <= pageMaxHeight) {
            // *** Underflow Retry ***
            // This happens when the page was rendered as smaller than the max size, and the
            // search window still has room for adjustment. In this case, a new search widow is
            // created from the lower half of the current search window to re-render the page to
            // be larger.
            let newRange: [number, number] = [pivot, range[1]];
            if (newRange[1] - newRange[0] <= 1) {
              // If the current search window is only 1 index apart, then set the new search
              // window to focus only on the lower bound index.
              newRange = [newRange[1], newRange[1]];
            }
            return await renderTruncatedPage(newRange, range, false);
          } else {
            // *** Overflow Retry ***
            // This happens when the page was rendered as larger than the max size, and this
            // search window still has room for adjustment. In this case, a new search window is
            // created from the upper half of the current search window to re-render the page to
            // be smaller.
            let newRange: [number, number] = [range[0], pivot];
            if (newRange[1] - newRange[0] <= 1) {
              // If the current search window is only 1 index apart, then set the new search
              // window to focus only on the upper bound index.
              newRange = [newRange[0], newRange[0]];
            }
            return await renderTruncatedPage(newRange, range, false);
          }
        }
      }
    };

    // Render a page, then recursively render the rest of the pages.
    const [page, restComponents] = await renderTruncatedPage(null, null, false);
    const restPages = await renderPages(pageNumber + 1, restComponents);
    return [page, ...restPages];
  };
  return renderPages;
};
