/* eslint-disable prettier/prettier */
import { phrasalTemplateCompatibleResponseTypes } from '~/abstract/lib/constants';
import { ActivityItemType } from '~/entities/activity/lib';
import { ItemRecord } from '~/entities/applet/model';

type ActivityPhrasalDataGenericContext = {
  itemResponseType: ActivityItemType;
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

type ActivityPhrasalParagraphFieldData = ActivityPhrasalBaseData<'paragraph', string[]>;

type ActivityPhrasalItemizedArrayValue = Record<number, string[]>;

type ActivityPhrasalIndexedArrayFieldData = ActivityPhrasalBaseData<
  'indexed-array',
  ActivityPhrasalItemizedArrayValue
>;

type ActivityPhrasalIndexedMatrixValue = {
  label: string;
  values: string[];
};

type ActivityPhrasalMatrixValue = {
  byRow: ActivityPhrasalIndexedMatrixValue[];
  byColumn: ActivityPhrasalIndexedMatrixValue[];
};

type ActivityPhrasalMatrixFieldData = ActivityPhrasalBaseData<'matrix', ActivityPhrasalMatrixValue>;

type ActivityPhrasalData =
  | ActivityPhrasalArrayFieldData
  | ActivityPhrasalIndexedArrayFieldData
  | ActivityPhrasalMatrixFieldData
  | ActivityPhrasalParagraphFieldData;

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
      const dateFieldData: ActivityPhrasalArrayFieldData = {
        type: 'array',
        values: item.answer
          .map((value) => new Date(value))
          .filter((value) => !!value)
          .map((value) => value.toLocaleTimeString()),
        context: fieldDataContext,
      };
      fieldData = dateFieldData;
    } else if (
      item.responseType === 'numberSelect' ||
      item.responseType === 'slider' ||
      item.responseType === 'text'
    ) {
      const dateFieldData: ActivityPhrasalArrayFieldData = {
        type: 'array',
        values: item.answer.map((value) => `${value || ''}`),
        context: fieldDataContext,
      };
      fieldData = dateFieldData;
    } else if (item.responseType === 'paragraphText') {
      const dateFieldData: ActivityPhrasalParagraphFieldData = {
        type: 'paragraph',
        values: item.answer.map((value) => value || ''),
        context: fieldDataContext,
      };
      fieldData = dateFieldData;
    } else if (item.responseType === 'singleSelect' || item.responseType === 'multiSelect') {
      const dateFieldData: ActivityPhrasalArrayFieldData = {
        type: 'array',
        values: item.answer
          .map((value) => item.responseValues.options[parseInt(value, 10)]?.text)
          .filter((value) => !!value),
        context: fieldDataContext,
      };
      fieldData = dateFieldData;
    } else if (item.responseType === 'multiSelectRows') {
      const byRow = item.responseValues.rows.map<ActivityPhrasalIndexedMatrixValue>(
        (row, rowIndex) => {
          return {
            label: row.rowName,
            values:
              item.answer[rowIndex]?.filter<string>(
                (value): value is string => value !== null && value !== undefined,
              ) || [],
          };
        },
      );

      const byColumn = item.responseValues.options.map<ActivityPhrasalIndexedMatrixValue>(
        (option) => {
          const answerIndices: number[] = [];
          item.answer.forEach((values, answerIndex) => {
            if (values.find((value) => value === option.text)) {
              answerIndices.push(answerIndex);
            }
          });
          return {
            label: option.text,
            values: answerIndices.map(
              (answerIndex) => item.responseValues.rows[answerIndex].rowName || '',
            ),
          };
        },
      );

      const dateFieldData: ActivityPhrasalMatrixFieldData = {
        type: 'matrix',
        values: { byRow, byColumn },
        context: fieldDataContext,
      };
      fieldData = dateFieldData;
    } else if (item.responseType === 'singleSelectRows') {
      const byRow = item.responseValues.rows.map<ActivityPhrasalIndexedMatrixValue>(
        (row, rowIndex) => {
          return {
            label: row.rowName,
            values: [
              item.responseValues.options.find((option) => option.id === item.answer[rowIndex])
                ?.text || '',
            ],
          };
        },
      );

      const byColumn = item.responseValues.options.map<ActivityPhrasalIndexedMatrixValue>(
        (option) => {
          return {
            label: option.text,
            values: [item.responseValues.rows[item.answer.indexOf(option.id)]?.rowName || ''],
          };
        },
      );

      const dateFieldData: ActivityPhrasalMatrixFieldData = {
        type: 'matrix',
        values: { byRow, byColumn },
        context: fieldDataContext,
      };
      fieldData = dateFieldData;
    } else if (item.responseType === 'sliderRows') {
      (fieldDataContext as ActivityPhrasalDataSliderRowContext).maxValues =
        item.responseValues.rows.map(({ maxValue }) => maxValue);

      const dateFieldData: ActivityPhrasalIndexedArrayFieldData = {
        type: 'indexed-array',
        values: item.answer.reduce((acc, answerValue, answerIndex) => {
          acc[answerIndex] = [`${answerValue || ''}`];
          return acc;
        }, {} as ActivityPhrasalItemizedArrayValue),
        context: fieldDataContext,
      };
      fieldData = dateFieldData;
    }

    if (fieldData) {
      data[item.name] = fieldData;
    }
  }

  return data;
};
