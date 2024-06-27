import React from 'react';

import { Image, View, Text } from '@react-pdf/renderer';

import { useXScaledDimension, useYScaledDimension } from '~/pages/ActionPlan/hooks';
import { Phrase } from '~/pages/ActionPlan/types';
import { Theme } from '~/shared/constants';

function TextSegment({ text }: { text: string }) {
  return <Text style={{ fontSize: 'inherit', lineHeight: 'inherit' }}>{text}</Text>;
}

function ResponseSegment({ text }: { text: string | string[] }) {
  const listPadding = useXScaledDimension(40);

  let prefixComponent: React.ReactNode;
  let textComponent: React.ReactNode;

  if (Array.isArray(text)) {
    prefixComponent = <br />;
    // TODO: Figure out how to do a bullet list
    textComponent = (
      <View style={{ paddingLeft: `${listPadding}px` }}>
        {text.map((item, index) => (
          <Text key={index}>{item}</Text>
        ))}
      </View>
    );
  } else {
    prefixComponent = <>&nbsp;</>;
    textComponent = text;
  }

  return (
    <Text
      style={{
        fontWeight: 700,
        fontSize: 'inherit',
        lineHeight: 'inherit',
      }}
    >
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
    <View
      style={{
        display: 'flex',
        gap: `${gap}px`,
        minHeight: `${minHeight}px`,
      }}
    >
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: `${imageWidth}px`,
          height: `${imageHeight}px`,
        }}
      >
        {phrase.image && (
          <Image
            src={{
              uri: phrase.image,
              method: 'GET',
              headers: { 'Cache-Control': 'no-cache' },
              body: '',
            }}
            style={{
              width: imageWidth,
              height: imageHeight,
              borderRadius: '8px',
              border: `1px solid ${Theme.colors.light.inverseOnSurface}`,
              padding: `${imagePadding}px`,
            }}
          />
        )}
      </View>
      <View
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: `${lineHeight}px`,
        }}
      >
        {components}
      </View>
    </View>
  );
}
