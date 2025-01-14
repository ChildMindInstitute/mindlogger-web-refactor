/* eslint-disable prettier/prettier */
import { phrasalTemplateCompatibleResponseTypes } from '~/abstract/lib/constants';
import { ActivityItemType } from '~/entities/activity/lib';
import { ItemRecord } from '~/entities/applet/model';
import { formatToDtoTime } from '~/shared/utils';

type ActivityPhrasalDataGenericContext = {
  itemResponseType: ActivityItemType;
};

export type ActivityPhrasalDataSliderContext = ActivityPhrasalDataGenericContext & {
  itemResponseType: 'slider';
  maxValue: number;
};

export type ActivityPhrasalDataSliderRowContext = ActivityPhrasalDataGenericContext & {
  itemResponseType: 'sliderRows';
  maxValues: number[];
};

type ActivityPhrasalBaseData<
  TType extends string,
  TValue,
  TContext extends ActivityPhrasalDataGenericContext = ActivityPhrasalDataGenericContext,
> = {
  type: TType;
  values: TValue;
  context: TContext;
};

type ActivityPhrasalArrayFieldData = ActivityPhrasalBaseData<'array', string[]>;

type ActivityPhrasalItemizedArrayValue = Record<number, string[]>;

type ActivityPhrasalIndexedArrayFieldData = ActivityPhrasalBaseData<
  'indexed-array',
  ActivityPhrasalItemizedArrayValue
>;

type ActivityPhrasalIndexedMatrixValue = {
  rowLabel: string;
  columnLabels: string[];
};

type ActivityPhrasalMatrixValue = ActivityPhrasalIndexedMatrixValue[];

type ActivityPhrasalMatrixFieldData = ActivityPhrasalBaseData<'matrix', ActivityPhrasalMatrixValue>;

type ActivityPhrasalData =
  | ActivityPhrasalArrayFieldData
  | ActivityPhrasalIndexedArrayFieldData
  | ActivityPhrasalMatrixFieldData;

export type ActivitiesPhrasalData = Record<string, ActivityPhrasalData>;

export const extractActivitiesPhrasalData = (items: ItemRecord[]): ActivitiesPhrasalData => {
  const data: Record<string, ActivityPhrasalData> = {};
  for (const item of items) {
    if (!phrasalTemplateCompatibleResponseTypes.includes(item.responseType)) {
      continue;
    }

    const fieldDataContext: ActivityPhrasalDataGenericContext = {
      itemResponseType: item.responseType,
    };
    let fieldData: ActivityPhrasalData | null = null;

    if (item.responseType === 'date') {
      const dateFieldData: ActivityPhrasalArrayFieldData = {
        type: 'array',
        values: item.answer
          .map((value) => new Date(value))
          .filter((value) => !!value)
          .map((value) => value.toLocaleDateString()),
        context: fieldDataContext,
      };
      fieldData = dateFieldData;
    } else if (item.responseType === 'time' || item.responseType === 'timeRange') {
      const timeFieldData: ActivityPhrasalArrayFieldData = {
        type: 'array',
        values: item.answer
          .map((value) => new Date(value))
          .filter((value) => !!value)
          .map((value) => formatToDtoTime(value)),
        context: fieldDataContext,
      };
      fieldData = timeFieldData;
    } else if (
      item.responseType === 'numberSelect' ||
      item.responseType === 'text' ||
      item.responseType === 'paragraphText'
    ) {
      const textFieldData: ActivityPhrasalArrayFieldData = {
        type: 'array',
        values: item.answer.map((value) => `${value ?? ''}`),
        context: fieldDataContext,
      };
      fieldData = textFieldData;
    } else if (item.responseType === 'singleSelect' || item.responseType === 'multiSelect') {
      const selectFieldData: ActivityPhrasalArrayFieldData = {
        type: 'array',
        values: item.answer
          .map(
            (value) =>
              item.responseValues.options.find((option) => option.value === parseInt(value, 10))
                ?.text,
          )
          .filter((value): value is string => !!value),
        context: fieldDataContext,
      };
      fieldData = selectFieldData;
    } else if (
      item.responseType === 'singleSelectRows' ||
      item.responseType === 'multiSelectRows'
    ) {
      // Unifiy logic for both singleSelectRows and multiSelectRows item types:
      // - for singleSelectRows, map each answer to an array of one element
      // - for multiSelectRows, answers are tracked as the _label_ of the column rather than ID,
      //   so we need to normalize to ID to align with singleSelectRows
      const answers =
        item.responseType === 'singleSelectRows'
          ? item.answer.map((value) => [value])
          : item.answer.map((values) =>
              values.map(
                (text) => item.responseValues.options.find((option) => option.text === text)?.id,
              ),
            );

      const values: ActivityPhrasalIndexedMatrixValue[] = [];

      answers.forEach((optionIds, rowIndex) => {
        const optionValues = item.responseValues.options
          .filter(({ id }) => optionIds.includes(id))
          .map(({ text }) => text);

        if (optionValues.length) {
          values.push({
            rowLabel: item.responseValues.rows[rowIndex].rowName,
            columnLabels: optionValues,
          });
        }
      });

      const matrixFieldData: ActivityPhrasalMatrixFieldData = {
        type: 'matrix',
        values,
        context: fieldDataContext,
      };
      fieldData = matrixFieldData;
    } else if (item.responseType === 'slider') {
      (fieldDataContext as ActivityPhrasalDataSliderContext).maxValue =
        item.responseValues.maxValue;

      const sliderFieldData: ActivityPhrasalArrayFieldData = {
        type: 'array',
        values: item.answer.map((value) => `${value ?? ''}`),
        context: fieldDataContext,
      };
      fieldData = sliderFieldData;
    } else if (item.responseType === 'sliderRows') {
      (fieldDataContext as ActivityPhrasalDataSliderRowContext).maxValues =
        item.responseValues.rows.map(({ maxValue }) => maxValue);

      const sliderRowsFieldData: ActivityPhrasalIndexedArrayFieldData = {
        type: 'indexed-array',
        values: item.answer.reduce((acc, answerValue, answerIndex) => {
          acc[answerIndex] = [`${answerValue ?? ''}`];
          return acc;
        }, {} as ActivityPhrasalItemizedArrayValue),
        context: fieldDataContext,
      };
      fieldData = sliderRowsFieldData;
    }

    if (fieldData) {
      data[item.name] = fieldData;
    }
  }

  return data;
};
