import { TFunction } from 'i18next';

import {
  DocumentData,
  FieldValueItemsJoiner,
  FieldValueTransformer,
  FlatComponentIndex,
  IdentifiablePhrasalTemplatePhrase,
  LineBreakPageComponent,
  ListItemResponsePageComponent,
  NewlinePageComponent,
  PageComponent,
  SentencePageComponent,
  TextItemResponsePageComponent,
} from './Document.type';
import {
  ActivitiesPhrasalData,
  ActivityPhrasalDataSliderContext,
  ActivityPhrasalDataSliderRowContext,
} from './phrasalData';

const isAnswersSkipped = (answers: string[]): boolean => {
  if (!answers || answers.length <= 0) {
    return true;
  }

  let allFalsy = true;
  for (const answer of answers) {
    if (answer !== null && answer !== undefined && answer.trim().length > 0) {
      allFalsy = false;
    }
  }

  return allFalsy;
};

const identity: FieldValueTransformer = (value) => value;
const sliderValueTransformer =
  (t: TFunction, maxValue: number): FieldValueTransformer =>
  (value) =>
    t('sliderValue', {
      value,
      total: maxValue,
    });

const joinWithComma: FieldValueItemsJoiner = (values) => values.join(', ');
const joinWithDash: FieldValueItemsJoiner = (values) => values.join(' - ');

/**
 * Transform phrasal data object into more render-friendly data structures. This purpose of this
 * transformation is to make the render component's code simpler: Instead of having individual
 * render component dealing with the complexities of phrasal data structure, we just deal with them
 * once at a centralized place. This way, render components can be code is a much more declarative
 * manner.
 * @param t Translation function
 * @param phrasalData Phrasal data object
 * @param phrases Phrasal template objects
 */
export const buildPageComponents = (
  t: TFunction,
  phrasalData: ActivitiesPhrasalData,
  phrases: IdentifiablePhrasalTemplatePhrase[],
): PageComponent[] => {
  const components: PageComponent[] = [];

  phrases.forEach((phrase, phraseIndex) => {
    phrase.fields.forEach((field) => {
      if (field.type === 'sentence') {
        const component: SentencePageComponent = {
          phraseIndex,
          phraseId: phrase.id,
          componentType: 'sentence',
          text: field.text,
        };
        components.push(component);
      } else if (field.type === 'item_response') {
        const fieldPhrasalData = phrasalData[field.itemName];
        const fieldPhrasalDataType = fieldPhrasalData.type;

        // Phrasal data for individual fields really should not be missing. But we should
        // still eliminate the logical path for nil/falsy values anyway.
        if (fieldPhrasalData) {
          let transformValue = identity;
          let joinValueItems = joinWithComma;
          if (fieldPhrasalData.context.itemResponseType === 'slider') {
            transformValue = sliderValueTransformer(
              t,
              (fieldPhrasalData.context as ActivityPhrasalDataSliderContext).maxValue,
            );
          } else if (fieldPhrasalData.context.itemResponseType === 'sliderRows') {
            transformValue = sliderValueTransformer(
              t,
              (fieldPhrasalData.context as ActivityPhrasalDataSliderRowContext).maxValues[
                field.itemIndex
              ],
            );
          } else if (fieldPhrasalData.context.itemResponseType === 'timeRange') {
            joinValueItems = joinWithDash;
          }

          let valueItems: string[];
          if (fieldPhrasalDataType === 'array') {
            valueItems = isAnswersSkipped(fieldPhrasalData.values)
              ? [t('questionSkipped')]
              : fieldPhrasalData.values.map(transformValue);
          } else if (fieldPhrasalDataType === 'indexed-array') {
            const indexedAnswers = fieldPhrasalData.values[field.itemIndex] || [];
            valueItems = isAnswersSkipped(indexedAnswers)
              ? [t('questionSkipped')]
              : indexedAnswers.map(transformValue);
          } else if (fieldPhrasalDataType === 'matrix') {
            const rowFirst =
              field.displayMode === 'sentence_row_option' ||
              field.displayMode === 'bullet_list_text_row';

            valueItems = [];
            for (const { rowLabel, columnLabels } of fieldPhrasalData.values) {
              for (const columnLabel of columnLabels) {
                valueItems.push(
                  rowFirst ? `${rowLabel} ${columnLabel}` : `${columnLabel} ${rowLabel}`,
                );
              }
            }

            if (isAnswersSkipped(valueItems)) {
              valueItems = [t('questionSkipped')];
            }
          } else {
            // This also shouldn't happen. But including a `else` here allows all
            // previous branches to have explicitly defined condition, so it's more
            // clear this way.
            throw new Error(`Invalid phrasal data type: ${fieldPhrasalDataType}`);
          }

          if (
            field.displayMode === 'bullet_list' ||
            field.displayMode === 'bullet_list_option_row' ||
            field.displayMode === 'bullet_list_text_row'
          ) {
            const component: ListItemResponsePageComponent = {
              phraseIndex,
              phraseId: phrase.id,
              componentType: 'item_response',
              itemResponseType: 'list',
              items: valueItems,
            };
            components.push(component);
          } else if (fieldPhrasalData.context.itemResponseType === 'paragraphText') {
            valueItems
              .flatMap((item) => item.split(/\r?\n/))
              .forEach((text, index) => {
                if (index > 0) {
                  const component: NewlinePageComponent = {
                    phraseIndex,
                    phraseId: phrase.id,
                    componentType: 'newline',
                  };
                  components.push(component);
                }

                const component: TextItemResponsePageComponent = {
                  phraseIndex,
                  phraseId: phrase.id,
                  componentType: 'item_response',
                  itemResponseType: 'text',
                  text: text || ' ', // Preserve empty lines
                };
                components.push(component);
              });
          } else {
            const component: TextItemResponsePageComponent = {
              phraseIndex,
              phraseId: phrase.id,
              componentType: 'item_response',
              itemResponseType: 'text',
              text: joinValueItems(valueItems),
            };
            components.push(component);
          }
        }
      } else if (field.type === 'line_break') {
        const component: LineBreakPageComponent = {
          phraseIndex,
          phraseId: phrase.id,
          componentType: 'line_break',
        };
        components.push(component);
      }
    });
  });

  return components;
};

export const buildDocumentData = (phrases: IdentifiablePhrasalTemplatePhrase[]): DocumentData => {
  const imageUrlByPhraseId = phrases.reduce(
    (acc, phrase) => (phrase.image ? { ...acc, [phrase.id]: phrase.image } : acc),
    {} as Record<string, string>,
  );

  const hasImage = Object.keys(imageUrlByPhraseId).length > 0;

  return { imageUrlByPhraseId, hasImage };
};

export const getPagePhraseIds = (components: PageComponent[]) =>
  components.reduce(
    (acc, component) => (acc.includes(component.phraseId) ? acc : [...acc, component.phraseId]),
    [] as string[],
  );

/**
 * Generate a flattened list of component-content indices to be used by the binary search based
 * truncation algorithm. Instead of having to perform binary search on multiple levels of the data
 * structure, this flattened list allows binary search to be performed on only a single level. This
 * greatly simplifies the implementation of the truncation algorithm. And the related function
 * `deepDivideComponents` is then used to divide the data structure at a
 * particular component-content index.
 * @param components The list of page components to generate indices from.
 */
export const getFlatComponentIndices = (components: PageComponent[]): FlatComponentIndex[] =>
  components
    .map<FlatComponentIndex[]>((component, componentIndex) => {
      if (component.componentType === 'item_response') {
        if (component.itemResponseType === 'list') {
          return component.items.map((_, itemIndex) => [componentIndex, itemIndex]);
        } else {
          return component.text.split(' ').map((_, wordIndex) => [componentIndex, wordIndex]);
        }
      } else if (component.componentType === 'sentence') {
        return component.text.split(' ').map((_, wordIndex) => [componentIndex, wordIndex]);
      } else {
        return [[componentIndex]];
      }
    })
    .flat();

// Set this to `false` to turn off truncation of list items.
const TRUNCATE_LIST_ITEMS: boolean = true;

const divideComponents = (
  components: PageComponent[],
  inclusiveEnd: number,
): [PageComponent[], PageComponent[]] => [
  components.slice(0, inclusiveEnd + 1),
  components.slice(inclusiveEnd + 1),
];

const divideTextItems = (items: string[], inclusiveEnd: number): [string[], string[]] => [
  [...items.slice(0, inclusiveEnd + 1), '…'],
  ['…', ...items.slice(inclusiveEnd + 1)],
];

/**
 * Deeply divide a given list of page components at the given component-content index. When a
 * component is divided at content level, connective `…` are added to both ends of the resulting
 * splits.
 * @param components The list of page components to divide.
 * @param flatIndices The list of component-content indices to choose a division point from.
 * @param inclusivePivot The index element at which a component-content index will be selected to
 * perform division at. The chosen component-content index will be used in a inclusive manner.
 */
export const deepDivideComponents = (
  components: PageComponent[],
  flatIndices: FlatComponentIndex[],
  inclusivePivot: number,
): [PageComponent[], PageComponent[]] => {
  const inclusiveEnd = flatIndices[inclusivePivot];

  if (inclusiveEnd.length === 1) {
    const [inclusiveComponentEnd] = inclusiveEnd;
    return divideComponents(components, inclusiveComponentEnd);
  } else {
    const [inclusiveComponentEnd, inclusiveContentEnd] = inclusiveEnd;
    const component = components[inclusiveComponentEnd];

    if (component.componentType === 'sentence') {
      const items = component.text.split(' ');
      if (inclusiveContentEnd >= items.length - 1) {
        return divideComponents(components, inclusiveComponentEnd);
      } else {
        const itemSplits = divideTextItems(items, inclusiveContentEnd);
        const split: [SentencePageComponent, SentencePageComponent] = [
          { ...component, text: itemSplits[0].join(' ') },
          { ...component, text: itemSplits[1].join(' ') },
        ];
        return [
          [...components.slice(0, inclusiveComponentEnd), split[0]],
          [split[1], ...components.slice(inclusiveComponentEnd + 1)],
        ];
      }
    } else if (component.componentType === 'item_response') {
      if (component.itemResponseType === 'list') {
        if (TRUNCATE_LIST_ITEMS) {
          const items = component.items;
          if (inclusiveContentEnd >= items.length - 1) {
            return divideComponents(components, inclusiveComponentEnd);
          } else {
            const itemSplits = divideTextItems(items, inclusiveContentEnd);
            const split: [ListItemResponsePageComponent, ListItemResponsePageComponent] = [
              { ...component, items: itemSplits[0] },
              { ...component, items: itemSplits[1] },
            ];
            return [
              [...components.slice(0, inclusiveComponentEnd), split[0]],
              [split[1], ...components.slice(inclusiveComponentEnd + 1)],
            ];
          }
        } else {
          return divideComponents(components, inclusiveComponentEnd);
        }
      } else {
        const items = component.text.split(' ');
        if (inclusiveContentEnd >= items.length - 1) {
          return divideComponents(components, inclusiveComponentEnd);
        } else {
          const itemSplits = divideTextItems(items, inclusiveContentEnd);
          const split: [TextItemResponsePageComponent, TextItemResponsePageComponent] = [
            { ...component, text: itemSplits[0].join(' ') },
            { ...component, text: itemSplits[1].join(' ') },
          ];
          return [
            [...components.slice(0, inclusiveComponentEnd), split[0]],
            [split[1], ...components.slice(inclusiveComponentEnd + 1)],
          ];
        }
      }
    } else {
      // Line-break and newline items don't have "content". So just divide at components level.
      return divideComponents(components, inclusiveComponentEnd);
    }
  }
};
