import React, { ComponentProps, useMemo } from 'react';

import Avatar from '@mui/material/Avatar';

import { DocumentData, PageComponent } from './Document.type';
import { useXScaledDimension, useYScaledDimension } from './hooks';
import { ResponseSegment } from './ResponseSegment';
import { TextSegment } from './TextSegment';

import { Theme } from '~/shared/constants';
import Box from '~/shared/ui/Box';

export type PhraseProps = {
  phraseId: string;
  documentData: DocumentData;
  pageComponents: PageComponent[];
  isFirstOnPage: boolean;
  isLastOnPage: boolean;
};

export const Phrase = ({
  phraseId,
  documentData,
  pageComponents,
  isFirstOnPage,
  isLastOnPage,
}: PhraseProps) => {
  const gap = useXScaledDimension(24);
  const minHeight = useXScaledDimension(72);
  const imageWidth = useXScaledDimension(67);
  const imageHeight = useXScaledDimension(66);
  const imagePadding = useXScaledDimension(2);
  const fontSize = useXScaledDimension(16);
  const lineHeight = useYScaledDimension(24);

  const phraseComponents = useMemo(
    () =>
      pageComponents.reduce((acc, component, componentIndex) => {
        if (component.phraseId === phraseId) {
          if (
            (isFirstOnPage && componentIndex === 0) ||
            (isLastOnPage && componentIndex === pageComponents.length - 1)
          ) {
            // Remove leading and trailing line-break components.
            if (component.componentType !== 'line_break') {
              acc.push(component);
            }
          } else {
            acc.push(component);
          }
        }
        return acc;
      }, [] as PageComponent[]),
    [pageComponents, phraseId, isFirstOnPage, isLastOnPage],
  );

  const renderedComponents = useMemo(() => {
    const rendered: React.ReactNode[] = [];

    let previousComponentType: PageComponent['componentType'] | undefined;
    phraseComponents.forEach((component, componentIndex) => {
      const componentType = component.componentType;
      const isAtStart = componentIndex === 0 || previousComponentType === 'line_break';

      if (componentType === 'sentence') {
        rendered.push(<TextSegment text={component.text} isAtStart={isAtStart} />);
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
        rendered.push(<ResponseSegment itemResponse={itemResponse} isAtStart={isAtStart} />);
      } else if (componentType === 'line_break') {
        rendered.push(<Box component="hr" sx={{ m: 0, height: 32, border: 'none' }} />);
      }

      previousComponentType = componentType;
    });

    return rendered;
  }, [phraseComponents]);

  const imageUrl = documentData.imageUrlByPhraseId[phraseId];

  return (
    <Box display="flex" gap={`${gap}px`} minHeight={minHeight}>
      {documentData.hasImage && (
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
