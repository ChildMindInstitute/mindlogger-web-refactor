import { TFunction } from 'i18next';

import { useXScaledDimension } from './hooks';
import { ActivitiesPhrasalData, ActivityPhrasalDataSliderRowContext } from './phrasalData';

import { PhrasalTemplateItemResponseField } from '~/entities/activity';
import { useActionPlanTranslation } from '~/entities/activity/lib/useActionPlanTranslation';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';

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

type ResponseSegmentProps = {
  phrasalData: ActivitiesPhrasalData;
  field: PhrasalTemplateItemResponseField;
  isAtStart?: boolean;
};

export const ResponseSegment = ({ phrasalData, field, isAtStart }: ResponseSegmentProps) => {
  const { t } = useActionPlanTranslation();
  const listPadding = useXScaledDimension(40);

  const fieldPhrasalData = phrasalData[field.itemName];
  if (!fieldPhrasalData) {
    // This really shouldn't happen. But we should still eliminate the logical
    // path for nil/falsy values anyway.
    return null;
  }

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
  } else if (fieldPhrasalData.type === 'indexed-array') {
    const indexedAnswers = fieldPhrasalData.values[field.itemIndex] || [];
    valueItems = isAnswersSkipped(indexedAnswers)
      ? [t('questionSkipped')]
      : indexedAnswers.map(transformValue);
  } else if (fieldPhrasalData.type === 'matrix') {
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
          return transformedValues.map((transformedValue) => `${label} ${transformedValue}`);
        })
        .flat();
    } else {
      valueItems = fieldPhrasalData.values.byColumn
        .map(({ label, values }) => {
          const transformedValues = isAnswersSkipped(values)
            ? [t('questionSkipped')]
            : values.map(transformValue);
          return transformedValues.map((transformedValue) => `${label} ${transformedValue}`);
        })
        .flat();
    }
  } else {
    // This also shouldn't happen. But including a `else` here allows all
    // previous branches to have explicitly defined condition, so it's more
    // clear this way.
    throw new Error(`Invalid phrasal data type: ${(fieldPhrasalData as { type: string }).type}`);
  }

  return (
    <Text component="span" fontWeight="700" fontSize="inherit" lineHeight="inherit">
      {field.displayMode === 'bullet_list' ||
      field.displayMode === 'bullet_list_option_row' ||
      field.displayMode === 'bullet_list_text_row' ? (
        <>
          {isAtStart ? null : (
            <span>
              &nbsp;
              <br />
            </span>
          )}
          <Box
            component="ul"
            marginTop={isAtStart ? `0px` : undefined}
            paddingLeft={`${listPadding}px`}
          >
            {valueItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </Box>
        </>
      ) : (
        <>
          {isAtStart ? '' : ' '}
          {joinValueItems(valueItems)}
        </>
      )}
    </Text>
  );
};
