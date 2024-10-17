import { TFunction } from 'i18next';

import { IdentifiablePhrasalTemplatePhrase } from './Document.type';
import { ActivitiesPhrasalData, ActivityPhrasalDataSliderRowContext } from './phrasalData';

import { PhrasalTemplateField } from '~/entities/activity/lib';

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

type FieldValueTransformer = (value: string) => string;
const identity: FieldValueTransformer = (value) => value;
const sliderValueTransformer =
  (
    t: TFunction,
    ctx: ActivityPhrasalDataSliderRowContext,
    itemIndex: number,
  ): FieldValueTransformer =>
  (value) =>
    t('sliderValue', { value, total: ctx.maxValues[itemIndex] });

type FieldValueItemsJoiner = (values: string[]) => string;
const joinWithComma: FieldValueItemsJoiner = (values) => values.join(', ');
const joinWithDash: FieldValueItemsJoiner = (values) => values.join(' - ');

type BasePageComponent = {
  phraseIndex: number;
  phraseId: string;
};

type SentencePageComponent = BasePageComponent & {
  componentType: 'sentence';
  text: string;
  isAtStart: boolean;
};

type BaseItemResponsePageComponent = BasePageComponent & {
  componentType: 'item_response';
  isAtStart: boolean;
};

type ListItemResponsePageComponent = BaseItemResponsePageComponent & {
  itemResponseType: 'list';
  items: string[];
};

type TextItemResponsePageComponent = BaseItemResponsePageComponent & {
  itemResponseType: 'text';
  text: string;
};

type ItemResponsePageComponent = ListItemResponsePageComponent | TextItemResponsePageComponent;

type LineBreakPageComponent = BasePageComponent & {
  componentType: 'line_break';
};

type PageComponent = SentencePageComponent | ItemResponsePageComponent | LineBreakPageComponent;

export const buildPageComponents = (
  t: TFunction,
  phrasalData: ActivitiesPhrasalData,
  phrases: IdentifiablePhrasalTemplatePhrase[],
): PageComponent[] => {
  const components: PageComponent[] = [];

  phrases.forEach((phrase, phraseIndex) => {
    let prevField: PhrasalTemplateField | null = null;

    phrase.fields.forEach((field, fieldIndex) => {
      const isAtStart = fieldIndex === 0 || prevField?.type === 'line_break';

      if (field.type === 'sentence') {
        const component: SentencePageComponent = {
          phraseIndex,
          phraseId: phrase.id,
          componentType: 'sentence',
          text: field.text,
          isAtStart,
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
          if (fieldPhrasalData.context.itemResponseType === 'sliderRows') {
            transformValue = sliderValueTransformer(
              t,
              fieldPhrasalData.context as ActivityPhrasalDataSliderRowContext,
              field.itemIndex,
            );
          } else if (fieldPhrasalData.context.itemResponseType === 'timeRange') {
            joinValueItems = joinWithDash;
          }

          let valueItems: string[];
          if (fieldPhrasalData.type === 'array') {
            valueItems = isAnswersSkipped(fieldPhrasalData.values)
              ? [t('questionSkipped')]
              : fieldPhrasalData.values.map(transformValue);
          } else if (fieldPhrasalDataType === 'indexed-array') {
            const indexedAnswers = fieldPhrasalData.values[field.itemIndex] || [];
            valueItems = isAnswersSkipped(indexedAnswers)
              ? [t('questionSkipped')]
              : indexedAnswers.map(transformValue);
          } else if (fieldPhrasalDataType === 'matrix') {
            // The admin UI actually allows matrix type items to have `sentence` as
            // their display mode. So in this case, we're just going to assume the
            // effective render order for the values to be "by row".
            let renderByRowValues = true;
            if (
              field.displayMode === 'sentence_option_row' ||
              field.displayMode === 'bullet_list_option_row'
            ) {
              renderByRowValues = false;
            } else if (
              field.displayMode === 'sentence_row_option' ||
              field.displayMode === 'bullet_list_text_row'
            ) {
              renderByRowValues = true;
            }

            if (renderByRowValues) {
              valueItems = fieldPhrasalData.values.byRow
                .map(({ label, values }) => {
                  const transformedValues = isAnswersSkipped(values)
                    ? [t('questionSkipped')]
                    : values.map(transformValue);
                  return transformedValues.map(
                    (transformedValue) => `${label} ${transformedValue}`,
                  );
                })
                .flat();
            } else {
              valueItems = fieldPhrasalData.values.byColumn
                .map(({ label, values }) => {
                  const transformedValues = isAnswersSkipped(values)
                    ? [t('questionSkipped')]
                    : values.map(transformValue);
                  return transformedValues.map(
                    (transformedValue) => `${label} ${transformedValue}`,
                  );
                })
                .flat();
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
              isAtStart,
            };
            components.push(component);
          } else {
            const component: TextItemResponsePageComponent = {
              phraseIndex,
              phraseId: phrase.id,
              componentType: 'item_response',
              itemResponseType: 'text',
              text: joinValueItems(valueItems),
              isAtStart,
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

      prevField = field;
    });
  });

  return components;
};
