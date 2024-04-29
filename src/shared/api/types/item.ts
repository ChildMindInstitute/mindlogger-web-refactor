import { ConditionalLogic } from './conditionalLogiс';

export type ItemResponseTypeDTO =
  | 'text'
  | 'singleSelect'
  | 'multiSelect'
  | 'message'
  | 'slider'
  | 'numberSelect'
  | 'timeRange'
  | 'geolocation'
  | 'drawing'
  | 'photo'
  | 'video'
  | 'date'
  | 'sliderRows'
  | 'singleSelectRows'
  | 'multiSelectRows'
  | 'audio'
  | 'audioPlayer'
  | 'time';

export interface ItemDetailsBaseDTO {
  id: string;
  name: string;
  question: string;
  order: number;
  isHidden: boolean;
  responseType: ItemResponseTypeDTO;
  config: ConfigDTO;
  responseValues: ResponseValuesDTO;
  conditionalLogic: ConditionalLogic | null;
}

export type ConfigDTO =
  | TextItemConfigDTO
  | CheckboxItemConfigDTO
  | RadioItemConfigDTO
  | SliderItemConfigDTO
  | SelectorItemConfigDTO
  | MessageItemConfigDTO
  | DateItemConfigDTO
  | TimeItemConfigDTO
  | TimeRangeItemConfigDTO
  | AudioPlayerItemConfigDTO
  | MultiSelectionRowsItemConfigDTO
  | SingleSelectionRowsItemConfigDTO;

export type ResponseValuesDTO =
  | EmptyResponseValuesDTO
  | CheckboxItemResponseValuesDTO
  | RadioItemResponseValuesDTO
  | SliderItemResponseValuesDTO
  | SelectorItemResponseValues
  | AudioPlayerItemResponseValuesDTO
  | MultiSelectionRowsItemResponseValuesDTO
  | SingleSelectionRowsItemResponseValuesDTO;

type EmptyResponseValuesDTO = null;

type DataMatrixDto = Array<{
  rowId: string;
  options: Array<{
    optionId: string;
    score: number;
    alert: string | null;
  }>;
}>;

type ButtonsConfigDTO = {
  removeBackButton: boolean;
  skippableItem: boolean;
};

type TimerConfigDTO = {
  timer: number | null;
};

export type AdditionalResponseOptionConfigDTO = {
  additionalResponseOption: {
    textInputOption: boolean;
    textInputRequired: boolean;
  };
};

export interface TextItemDTO extends ItemDetailsBaseDTO {
  responseType: 'text';
  config: TextItemConfigDTO;
  responseValues: EmptyResponseValuesDTO;
}

export type TextItemConfigDTO = {
  maxResponseLength: number; // default 300
  correctAnswerRequired: boolean; // default false
  correctAnswer: string; // default ""
  numericalResponseRequired: boolean; // default ""
  responseDataIdentifier: boolean; // default ""
  responseRequired: boolean; // default false
  removeBackButton: boolean;
  skippableItem: boolean;
};

export interface CheckboxItemDTO extends ItemDetailsBaseDTO {
  responseType: 'multiSelect';
  config: CheckboxItemConfigDTO;
  responseValues: CheckboxItemResponseValuesDTO;
}

export type CheckboxItemConfigDTO = AdditionalResponseOptionConfigDTO & {
  removeBackButton: boolean;
  skippableItem: boolean;
  randomizeOptions: boolean;
  timer: number | null;
  addScores: boolean;
  setAlerts: boolean;
  addTooltip: boolean;
  setPalette: boolean;
};

export type CheckboxItemResponseValuesDTO = {
  options: Array<{
    id: string;
    text: string;
    image: string | null;
    score: number | null;
    tooltip: string | null;
    color: string | null;
    isHidden: boolean;
    alert: string | null;
    value: number;
    isNoneAbove: boolean;
  }>;
};

export interface RadioItemDTO extends ItemDetailsBaseDTO {
  responseType: 'singleSelect';
  config: RadioItemConfigDTO;
  responseValues: RadioItemResponseValuesDTO;
}

export type RadioItemConfigDTO = AdditionalResponseOptionConfigDTO & {
  removeBackButton: boolean;
  skippableItem: boolean;
  randomizeOptions: boolean;
  timer: number | null;
  addScores: boolean;
  setAlerts: boolean;
  addTooltip: boolean;
  setPalette: boolean;
  autoAdvance: boolean;
};

export type RadioItemResponseValuesDTO = {
  options: Array<{
    id: string;
    text: string;
    image: string | null;
    score: number | null;
    tooltip: string | null;
    color: string | null;
    isHidden: boolean;
    alert: string | null;
    value: number;
  }>;
};

export interface SliderItemDTO extends ItemDetailsBaseDTO {
  responseType: 'slider';
  config: SliderItemConfigDTO;
  responseValues: SliderItemResponseValuesDTO;
}

type SliderItemConfigDTO = AdditionalResponseOptionConfigDTO & {
  addScores: boolean;
  setAlerts: boolean;
  showTickMarks: boolean;
  showTickLabels: boolean;
  continuousSlider: boolean;
  removeBackButton: boolean;
  skippableItem: boolean;
  timer: number | null;
};

type SliderItemResponseValuesDTO = {
  minLabel: string | null;
  maxLabel: string | null;
  minValue: number;
  maxValue: number;
  minImage: string | null;
  maxImage: string | null;
  scores: Array<number> | null;
  alerts: Array<{
    value: number;
    minValue: number;
    maxValue: number;
    alert: string;
  }> | null;
};

export interface SelectorItemDTO extends ItemDetailsBaseDTO {
  responseType: 'numberSelect';
  config: SelectorItemConfigDTO;
  responseValues: SelectorItemResponseValues;
}

type SelectorItemConfigDTO = AdditionalResponseOptionConfigDTO & {
  removeBackButton: boolean;
  skippableItem: boolean;
};

type SelectorItemResponseValues = {
  minValue: number;
  maxValue: number;
};

export interface MessageItemDTO extends ItemDetailsBaseDTO {
  responseType: 'message';
  config: MessageItemConfigDTO;
  responseValues: EmptyResponseValuesDTO;
}

type MessageItemConfigDTO = {
  removeBackButton: boolean;
  timer: number | null;
};

export interface DateItemDTO extends ItemDetailsBaseDTO {
  responseType: 'date';
  config: DateItemConfigDTO;
  responseValues: EmptyResponseValuesDTO;
}

type DateItemConfigDTO = AdditionalResponseOptionConfigDTO & {
  removeBackButton: boolean;
  skippableItem: boolean;
  timer: number | null;
};

export interface TimeItemDTO extends ItemDetailsBaseDTO {
  responseType: 'time';
  config: TimeItemConfigDTO;
  responseValues: EmptyResponseValuesDTO;
}

type TimeItemConfigDTO = AdditionalResponseOptionConfigDTO & {
  removeBackButton: boolean;
  skippableItem: boolean;
  timer: number | null;
};

export interface TimeRangeItemDTO extends ItemDetailsBaseDTO {
  responseType: 'timeRange';
  config: TimeRangeItemConfigDTO;
  responseValues: EmptyResponseValuesDTO;
}

type TimeRangeItemConfigDTO = AdditionalResponseOptionConfigDTO & {
  removeBackButton: boolean;
  skippableItem: boolean;
  timer: number | null;
};

export interface AudioPlayerItemDTO extends ItemDetailsBaseDTO {
  responseType: 'audioPlayer';
  config: AudioPlayerItemConfigDTO;
  responseValues: AudioPlayerItemResponseValuesDTO;
}

type AudioPlayerItemConfigDTO = AdditionalResponseOptionConfigDTO & {
  playOnce: boolean;
  removeBackButton: boolean;
  skippableItem: boolean;
};

type AudioPlayerItemResponseValuesDTO = {
  file: string;
};

export interface MultiSelectionRowsItemDTO extends ItemDetailsBaseDTO {
  responseType: 'multiSelectRows';
  config: MultiSelectionRowsItemConfigDTO;
  responseValues: MultiSelectionRowsItemResponseValuesDTO;
}

type MultiSelectionRowsItemConfigDTO = ButtonsConfigDTO &
  TimerConfigDTO & {
    addScores: boolean;
    setAlerts: boolean;
    addTooltip: boolean;
  };

type MultiSelectionRowsItemResponseValuesDTO = {
  rows: Array<{
    id: string;
    rowName: string;
    rowImage: string | null;
    tooltip: string | null;
  }>;
  options: Array<{
    id: string;
    text: string;
    image: string | null;
    tooltip: string | null;
  }>;
  dataMatrix: DataMatrixDto;
};

export interface SingleSelectionRowsItemDTO extends ItemDetailsBaseDTO {
  responseType: 'multiSelectRows';
  config: SingleSelectionRowsItemConfigDTO;
  responseValues: SingleSelectionRowsItemResponseValuesDTO;
}

type SingleSelectionRowsItemConfigDTO = ButtonsConfigDTO &
  TimerConfigDTO & {
    addScores: boolean;
    setAlerts: boolean;
    addTooltip: boolean;
  };

type SingleSelectionRowsItemResponseValuesDTO = {
  rows: Array<{
    id: string;
    rowName: string;
    rowImage: string | null;
    tooltip: string | null;
  }>;
  options: Array<{
    id: string;
    text: string;
    image: string | null;
    tooltip: string | null;
  }>;
  dataMatrix: DataMatrixDto;
};
