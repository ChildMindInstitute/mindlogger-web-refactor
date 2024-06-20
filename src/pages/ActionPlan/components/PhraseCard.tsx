import React from 'react';

import Avatar from '@mui/material/Avatar';

import { useXScaledDimension, useYScaledDimension } from '~/pages/ActionPlan/hooks';
import { Phrase } from '~/pages/ActionPlan/types';
import { Theme } from '~/shared/constants';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';

function TextSegment({ text }: { text: string }) {
  return (
    <Text component="span" fontSize="inherit" lineHeight="inherit">
      {text}
    </Text>
  );
}

function ResponseSegment({ text }: { text: string | string[] }) {
  const listPadding = useXScaledDimension(40);

  let prefixComponent: React.ReactNode;
  let textComponent: React.ReactNode;

  if (Array.isArray(text)) {
    prefixComponent = <br />;
    textComponent = (
      <Box component="ul" paddingLeft={`${listPadding}px`}>
        {text.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </Box>
    );
  } else {
    prefixComponent = <>&nbsp;</>;
    textComponent = text;
  }

  return (
    <Text component="span" fontWeight="700" fontSize="inherit" lineHeight="inherit">
      {prefixComponent}
      {textComponent}
    </Text>
  );
}

export type PhraseProps = {
  phrase: Phrase;
};

export function PhraseCard({ phrase }: PhraseProps) {
  const gap = useXScaledDimension(24);
  const minHeight = useXScaledDimension(72);

  const imageWidth = useXScaledDimension(67);
  const imageHeight = useXScaledDimension(66);
  const imagePadding = useXScaledDimension(2);

  const fontSize = useXScaledDimension(16);
  const lineHeight = useYScaledDimension(24);

  const components: React.ReactNode[] = [];

  for (const part of phrase.parts) {
    switch (part.type) {
      case 'text':
        components.push(<TextSegment text={part.text} />);
        break;
      case 'responseItem':
        components.push(<ResponseSegment text={part.responseItem} />);
        break;
      case 'lineBreak':
        components.push(<br />);
        break;
    }
  }

  return (
    <Box display="flex" gap={`${gap}px`} minHeight={minHeight}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          minWidth: imageWidth,
          height: imageHeight,
        }}
      >
        {phrase.image && (
          <Avatar
            src={phrase.image}
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
      <Box fontSize={`${fontSize}px`} lineHeight={`${lineHeight}px`}>
        {components}
      </Box>
    </Box>
  );
}
