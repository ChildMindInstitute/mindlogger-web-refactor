import { extractActivitiesPhrasalData } from './phrasalData';

import { ItemRecord } from '~/entities/applet/model';
import { formatToDtoTime } from '~/shared/utils';

describe('Action Plan', () => {
  describe('extractActivitiesPhrasalData', () => {
    const newAudioPlayerItem = (name: string) =>
      ({
        name,
        responseType: 'audioPlayer',
        responseValues: { file: 'file://lol.mp3' },
        answer: [],
      }) as never as ItemRecord;

    const newSimpleItem =
      <TAnswer = string>(type: string) =>
      (name: string, answer: TAnswer[]) =>
        ({
          name,
          responseType: type,
          responseValues: null,
          answer,
        }) as never as ItemRecord;

    const newDateItem = newSimpleItem('date');
    const newTimeItem = newSimpleItem('time');
    const newTimeRangeItem = newSimpleItem('timeRange');
    const newNumberSelectItem = newSimpleItem<number>('numberSelect');
    const newTextItem = newSimpleItem('text');

    const newSelectItem = (type: string) => (name: string, answer: string[], options: string[]) =>
      ({
        name,
        responseType: type,
        responseValues: {
          options: options.map((option, value) => ({ text: option, value })),
        },
        answer,
      }) as never as ItemRecord;

    const newSingleSelectItem = newSelectItem('singleSelect');
    const newMultiSelectItem = newSelectItem('multiSelect');

    const newMultiSelectRowsItem = (
      name: string,
      answer: (string | null)[][],
      options: [string[], string[]],
    ) =>
      ({
        name,
        responseType: 'multiSelectRows',
        responseValues: {
          rows: options[0].map((option) => ({ rowName: option })),
          options: options[1].map((option, index) => ({ id: `col:${index}`, text: option })),
        },
        answer,
      }) as never as ItemRecord;

    const newSingleSelectRowsItem = (
      name: string,
      answer: (string | null)[],
      options: [string[], string[]],
    ) =>
      ({
        name,
        responseType: 'singleSelectRows',
        responseValues: {
          rows: options[0].map((option) => ({ rowName: option })),
          options: options[1].map((option, index) => ({ id: `col:${index}`, text: option })),
        },
        answer,
      }) as never as ItemRecord;

    const newSliderItem = (name: string, answer: string[], maxValue: number) =>
      ({
        name,
        responseType: 'slider',
        responseValues: { maxValue },
        answer,
      }) as never as ItemRecord;

    const newSliderRowsItem = (name: string, answer: number[], options: [number, number][]) =>
      ({
        name,
        responseType: 'sliderRows',
        responseValues: {
          rows: options.map(([min, max]) => ({ minValue: min, maxValue: max })),
        },
        answer,
      }) as never as ItemRecord;

    it('should not extract data from unsupported activity type', () => {
      const data = extractActivitiesPhrasalData([newAudioPlayerItem('item')]);
      expect(data).toEqual({});
    });

    it('should extract data from `date` activity type', () => {
      const date = new Date('Fri Sep 06 2024 00:00:00 GMT-0700 (Pacific Daylight Time)');
      const data = extractActivitiesPhrasalData([newDateItem('item', [date.toString()])]);

      expect(data).toHaveProperty('item');
      expect(data.item).toHaveProperty('type', 'array');
      expect(data.item).toHaveProperty('values.0', date.toLocaleDateString());
      expect(data.item).toHaveProperty('context.itemResponseType', 'date');
    });

    it('should extract data from `time` activity type', () => {
      const date = new Date('Wed Sep 04 2024 00:05:00 GMT-0700 (Pacific Daylight Time)');
      const data = extractActivitiesPhrasalData([newTimeItem('item', [date.toString()])]);

      expect(data).toHaveProperty('item');
      expect(data.item).toHaveProperty('type', 'array');
      expect(data.item).toHaveProperty('values.0', formatToDtoTime(date));
      expect(data.item).toHaveProperty('context.itemResponseType', 'time');
    });

    it('should extract data from `timeRange` activity type', () => {
      const date1 = new Date('Wed Sep 04 2024 00:05:00 GMT-0700 (Pacific Daylight Time)');
      const date2 = new Date('Wed Sep 04 2024 00:15:00 GMT-0700 (Pacific Daylight Time)');
      const data = extractActivitiesPhrasalData([
        newTimeRangeItem('item', [date1.toString(), date2.toString()]),
      ]);

      expect(data).toHaveProperty('item');
      expect(data.item).toHaveProperty('type', 'array');
      expect(data.item).toHaveProperty('values.0', formatToDtoTime(date1));
      expect(data.item).toHaveProperty('values.1', formatToDtoTime(date2));
      expect(data.item).toHaveProperty('context.itemResponseType', 'timeRange');
    });

    it('should extract data from `numberSelect` activity type', () => {
      const data = extractActivitiesPhrasalData([newNumberSelectItem('item', [7])]);

      expect(data).toHaveProperty('item');
      expect(data.item).toHaveProperty('type', 'array');
      expect(data.item).toHaveProperty('values.0', '7');
      expect(data.item).toHaveProperty('context.itemResponseType', 'numberSelect');
    });

    it('should extract data from `slider` activity type', () => {
      const data = extractActivitiesPhrasalData([newSliderItem('item', ['6'], 10)]);

      expect(data).toHaveProperty('item');
      expect(data.item).toHaveProperty('type', 'array');
      expect(data.item).toHaveProperty('values.0', '6');
      expect(data.item).toHaveProperty('context.itemResponseType', 'slider');
      expect(data.item).toHaveProperty('context.maxValue', 10);
    });

    it('should extract data from `text` activity type', () => {
      const data = extractActivitiesPhrasalData([newTextItem('item', ['oh hai'])]);

      expect(data).toHaveProperty('item');
      expect(data.item).toHaveProperty('type', 'array');
      expect(data.item).toHaveProperty('values.0', 'oh hai');
      expect(data.item).toHaveProperty('context.itemResponseType', 'text');
    });

    it('should extract data from `paragraphText` activity type', () => {
      const data = extractActivitiesPhrasalData([newTextItem('item', ['oh hai'])]);

      expect(data).toHaveProperty('item');
      expect(data.item).toHaveProperty('type', 'array');
      expect(data.item).toHaveProperty('values.0', 'oh hai');
      expect(data.item).toHaveProperty('context.itemResponseType', 'text');
    });

    it('should extract data from `singleSelect` activity type', () => {
      const data = extractActivitiesPhrasalData([
        newSingleSelectItem('item', ['1'], ['one', 'two', 'three']),
      ]);

      expect(data).toHaveProperty('item');
      expect(data.item).toHaveProperty('type', 'array');
      expect(data.item).toHaveProperty('values.0', 'two');
      expect(data.item).toHaveProperty('context.itemResponseType', 'singleSelect');
    });

    it('should extract data from `multiSelect` activity type', () => {
      const data = extractActivitiesPhrasalData([
        newMultiSelectItem('item', ['1', '0'], ['one', 'two', 'three']),
      ]);

      expect(data).toHaveProperty('item');
      expect(data.item).toHaveProperty('type', 'array');
      expect(data.item).toHaveProperty('values.0', 'two');
      expect(data.item).toHaveProperty('values.1', 'one');
      expect(data.item).toHaveProperty('context.itemResponseType', 'multiSelect');
    });

    it('should extract data from `multiSelectRows` activity type', () => {
      const data = extractActivitiesPhrasalData([
        newMultiSelectRowsItem(
          'item',
          [
            ['C1', 'C2', null],
            [null, 'C2', null],
            [null, 'C2', 'C3'],
          ],
          [
            ['R1', 'R2', 'R3'],
            ['C1', 'C2', 'C3'],
          ],
        ),
      ]);

      expect(data).toHaveProperty('item');
      expect(data.item).toHaveProperty('type', 'matrix');
      expect(data.item).toHaveProperty('values.0.rowLabel', 'R1');
      expect(data.item).toHaveProperty('values.0.columnLabels', ['C1', 'C2']);
      expect(data.item).toHaveProperty('values.1.rowLabel', 'R2');
      expect(data.item).toHaveProperty('values.1.columnLabels', ['C2']);
      expect(data.item).toHaveProperty('values.2.rowLabel', 'R3');
      expect(data.item).toHaveProperty('values.2.columnLabels', ['C2', 'C3']);
      expect(data.item).toHaveProperty('context.itemResponseType', 'multiSelectRows');
    });

    it('should extract data from `singleSelectRows` activity type', () => {
      const data = extractActivitiesPhrasalData([
        newSingleSelectRowsItem(
          'item',
          ['col:2', 'col:0', 'col:1'],
          [
            ['R1', 'R2', 'R3'],
            ['C1', 'C2', 'C3'],
          ],
        ),
      ]);

      expect(data).toHaveProperty('item');
      expect(data.item).toHaveProperty('type', 'matrix');
      expect(data.item).toHaveProperty('values.0.rowLabel', 'R1');
      expect(data.item).toHaveProperty('values.0.columnLabels', ['C3']);
      expect(data.item).toHaveProperty('values.1.rowLabel', 'R2');
      expect(data.item).toHaveProperty('values.1.columnLabels', ['C1']);
      expect(data.item).toHaveProperty('values.2.rowLabel', 'R3');
      expect(data.item).toHaveProperty('values.2.columnLabels', ['C2']);
      expect(data.item).toHaveProperty('context.itemResponseType', 'singleSelectRows');
    });

    it('should extract data from `sliderRows` activity type', () => {
      const data = extractActivitiesPhrasalData([
        newSliderRowsItem(
          'item',
          [3, 6, 9],
          [
            [0, 10],
            [0, 11],
            [0, 12],
          ],
        ),
      ]);

      expect(data).toHaveProperty('item');
      expect(data.item).toHaveProperty('type', 'indexed-array');
      expect(data.item).toHaveProperty('values.0.0', '3');
      expect(data.item).toHaveProperty('values.1.0', '6');
      expect(data.item).toHaveProperty('values.2.0', '9');
      expect(data.item).toHaveProperty('context.itemResponseType', 'sliderRows');
      expect(data.item).toHaveProperty('context.maxValues.0', 10);
      expect(data.item).toHaveProperty('context.maxValues.1', 11);
      expect(data.item).toHaveProperty('context.maxValues.2', 12);
    });
  });
});
