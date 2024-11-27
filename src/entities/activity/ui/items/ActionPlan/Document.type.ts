import React from 'react';

import { PhrasalTemplatePhrase } from '~/entities/activity';

export type IdentifiablePhrasalTemplatePhrase = PhrasalTemplatePhrase & { id: string };

// This should be kept in a separate file from `Document` because both `Document` and `Page` need
// this context, but `Document` also needs `Page`. So keeping this context in this separate file
// avoids a circular import path.
export const DocumentContext = React.createContext<{
  totalPages: number;
}>({
  totalPages: 0,
});

export type FieldValueTransformer = (value: string) => string;

export type FieldValueItemsJoiner = (values: string[]) => string;

type BasePageComponent = {
  phraseIndex: number;
  phraseId: string;
};

export type SentencePageComponent = BasePageComponent & {
  componentType: 'sentence';
  text: string;
};

type BaseItemResponsePageComponent = BasePageComponent & {
  componentType: 'item_response';
};

export type ListItemResponsePageComponent = BaseItemResponsePageComponent & {
  componentType: 'item_response';
  itemResponseType: 'list';
  items: string[];
};

export type TextItemResponsePageComponent = BaseItemResponsePageComponent & {
  componentType: 'item_response';
  itemResponseType: 'text';
  text: string;
};

type ItemResponsePageComponent = ListItemResponsePageComponent | TextItemResponsePageComponent;

export type LineBreakPageComponent = BasePageComponent & {
  componentType: 'line_break';
};

/**
 * Newline is a special component that is used to force a new line in the document, used when
 * rendering the `paragraphText` item type.
 */
export type NewlinePageComponent = BasePageComponent & {
  componentType: 'newline';
};

export type PageComponent =
  | SentencePageComponent
  | ItemResponsePageComponent
  | LineBreakPageComponent
  | NewlinePageComponent;

export type DocumentData = {
  imageUrlByPhraseId: Record<string, string>;
  hasImage: boolean;
};

export type FlatComponentIndex = [number] | [number, number];

export type PageRenderer = (
  pageNumber: number,
  components: PageComponent[],
  flatIndices: FlatComponentIndex[],
  inclusivePivot: number,
) => Promise<{ page: React.ReactNode; pageHeight: number; restComponents: PageComponent[] }>;
