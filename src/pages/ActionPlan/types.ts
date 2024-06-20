export type TextPhraseItem = {
  type: 'text';
  text: string;
};

export type ResponseItemPhraseItem = {
  type: 'responseItem';
  responseItem: string | string[];
};

export type LineBreakPhraseItem = {
  type: 'lineBreak';
};

export type PhraseItem = TextPhraseItem | ResponseItemPhraseItem | LineBreakPhraseItem;

export type Phrase = {
  id: string;
  image: string | null;
  parts: PhraseItem[];
};
