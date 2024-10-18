import React, { ComponentProps, useMemo } from 'react';

import Avatar from '@mui/material/Avatar';

import { useXScaledDimension, useYScaledDimension } from './hooks';
import { ResponseSegment } from './ResponseSegment';
import { TextSegment } from './TextSegment';

import { PageData } from '~/entities/activity/ui/items/ActionPlan/pageComponent';
import { Theme } from '~/shared/constants';
import Box from '~/shared/ui/Box';

export type PhraseProps = {
  phraseId: string;
  pageData: PageData;
};

export const Phrase = ({ phraseId, pageData }: PhraseProps) => {
  const gap = useXScaledDimension(24);
  const minHeight = useXScaledDimension(72);
  const imageWidth = useXScaledDimension(67);
  const imageHeight = useXScaledDimension(66);
  const imagePadding = useXScaledDimension(2);
  const fontSize = useXScaledDimension(16);
  const lineHeight = useYScaledDimension(24);

  const phraseComponents = useMemo(
    () => pageData.components.filter((component) => component.phraseId === phraseId),
    [pageData, phraseId],
  );

  const renderedComponents = useMemo(() => {
    const rendered: React.ReactNode[] = [];

    phraseComponents.forEach((component) => {
      const componentType = component.componentType;
      if (componentType === 'sentence') {
        rendered.push(<TextSegment text={component.text} isAtStart={component.isAtStart} />);
      } else if (componentType === 'item_response') {
        let itemResponse: ComponentProps<typeof ResponseSegment>['itemResponse'];
        if (component.itemResponseType === 'list') {
          itemResponse = {
            itemResponseType: 'list',
            items: component.items,
          };
        } else {
          itemResponse = {
            itemResponseType: 'text',
            text: component.text,
          };
        }

        rendered.push(
          <ResponseSegment itemResponse={itemResponse} isAtStart={component.isAtStart} />,
        );
      } else if (componentType === 'line_break') {
        rendered.push(<br />);
      }
    });

    return rendered;
  }, [phraseComponents]);

  const imageUrl = pageData.imageUrlByPhraseId[phraseId];

  return (
    <Box display="flex" gap={`${gap}px`} minHeight={minHeight}>
      {pageData.hasImage && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            minWidth: imageWidth,
            height: imageHeight,
          }}
        >
          {imageUrl && (
            <Avatar
              src={imageUrl}
              variant="square"
              sx={{
                width: imageWidth,
                height: imageHeight,
                borderRadius: '8px',
                border: `1px solid ${Theme.colors.light.inverseOnSurface}`,
                padding: `${imagePadding}px`,
              }}
            />
          )}
        </Box>
      )}
      <Box fontSize={`${fontSize}px`} lineHeight={`${lineHeight}px`}>
        {React.Children.toArray(renderedComponents)}
      </Box>
    </Box>
  );
};
