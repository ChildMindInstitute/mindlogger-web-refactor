import {
  ActivityItemType,
  AudioPlayerItem,
  CheckboxItem,
  DateItem,
  MessageItem,
  MultiSelectionRowsItem,
  RadioItem,
  SingleSelectionRowsItem,
  SliderItem,
  SliderRows,
  TimeRangeItem,
} from '~/entities/activity';
import { appletModel } from '~/entities/applet';

export const ITEMS_WITH_TIMER: ActivityItemType[] = [
  'singleSelect',
  'multiSelect',
  'slider',
  'date',
  'timeRange',
  'singleSelectRows',
  'multiSelectRows',
  'sliderRows',
  'audio',
  'message',
];

export type ItemRecordWithTimer = Extract<
  appletModel.ItemRecord,
  | RadioItem
  | CheckboxItem
  | SliderItem
  | DateItem
  | TimeRangeItem
  | SingleSelectionRowsItem
  | MultiSelectionRowsItem
  | SliderRows
  | AudioPlayerItem
  | MessageItem
>;

export const canItemHaveTimer = (item: appletModel.ItemRecord): item is ItemRecordWithTimer => {
  return ITEMS_WITH_TIMER.includes(item.responseType);
};
