import { ConditionalLogic, PhrasalTemplateConfigDTO } from '~/shared/api';

export type DefaultAnswer = Array<string>;
export type MatrixMultiSelectAnswer = Array<Array<string | null>>;
export type SingleMultiSelectAnswer = Array<string | null>;
export type SliderRowsAnswer = Array<number | null>;

export type Answer =
  | DefaultAnswer
  | MatrixMultiSelectAnswer
  | SingleMultiSelectAnswer
  | SliderRowsAnswer;

export type ActivityItemType =
  | 'text'
  | 'paragraphText'
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
  | 'time'
  | 'sliderRows'
  | 'singleSelectRows'
  | 'multiSelectRows'
  | 'audio'
  | 'audioPlayer'
  | 'unsupportable'
  | 'splashScreen'
  | 'phrasalTemplate'
  | 'requestHealthRecordData';

export type ButtonsConfig = {
  removeBackButton: boolean;
  skippableItem: boolean;
};

export type TimerConfig = {
  timer: number | null;
};

export type AdditionalResponseConfig = {
  additionalResponseOption: {
    textInputOption: boolean;
    textInputRequired: boolean;
  };
};

export type DataMatrix = Array<{
  rowId: string;
  options: Array<{
    optionId: string;
    score: number;
    alert: string | null;
  }>;
}>;

export interface ActivityItemBase {
  id: string;
  name: string;
  question: string;
  order: number;
  responseType: ActivityItemType;
  config: Config;
  responseValues: ResponseValues;
  answer: Answer;
  additionalText?: string | null;
  conditionalLogic: ConditionalLogic | null;
  isHidden: boolean;
}

export type Config =
  | AudioPlayerItemConfig
  | CheckboxItemConfig
  | DateItemConfig
  | MessageItemConfig
  | MultiSelectionRowsItemConfig
  | ParagraphItemConfig
  | PhrasalTemplateItemConfig
  | RadioItemConfig
  | RequestHealthRecordDataItemConfig
  | SelectorItemConfig
  | SliderItemConfig
  | SliderRowsItemConfig
  | SplashScreenItemConfig
  | TextItemConfig
  | TimeItemItemConfig
  | TimeRangeItemConfig;

export type ResponseValues =
  | EmptyResponseValues
  | CheckboxValues
  | RadioValues
  | SliderValues
  | SelectorValues
  | AudioPlayerItemValues
  | MultiSelectionRowsItemResponseValues
  | SliderRowsItemResponseValues
  | PhrasalTemplateValues
  | RequestHealthRecordDataValues;

export type EmptyResponseValues = null;

export interface PhrasalTemplateItem extends ActivityItemBase {
  responseType: 'phrasalTemplate';
  config: PhrasalTemplateConfigDTO;
  responseValues: PhrasalTemplateValues;
  answer: DefaultAnswer;
}

export type PhrasalTemplateValues = {
  cardTitle: string;
  phrases: PhrasalTemplatePhrase[];
};

export type PhrasalTemplatePhrase = {
  fields: PhrasalTemplateField[];
  image: string | null;
};

export type PhrasalTemplateField =
  | PhrasalTemplateSentenceField
  | PhrasalTemplateItemResponseField
  | PhrasalTemplateLineBreakField;

export type PhrasalTemplateSentenceField = {
  type: 'sentence';
  text: string;
};

export type PhrasalTemplateItemResponseField = {
  type: 'item_response';
  itemIndex: number;
  itemName: string;
  displayMode: PhrasalTemplateItemResponseFieldDisplayMode;
};

export type PhrasalTemplateLineBreakField = {
  type: 'line_break';
};

export type PhrasalTemplateItemResponseFieldDisplayMode =
  | 'sentence'
  | 'sentence_option_row'
  | 'sentence_row_option'
  | 'bullet_list'
  | 'bullet_list_option_row'
  | 'bullet_list_text_row';

export interface TextItem extends ActivityItemBase {
  responseType: 'text';
  config: TextItemConfig;
  responseValues: EmptyResponseValues;
  answer: DefaultAnswer;
}

export type TextItemConfig = ButtonsConfig & {
  maxResponseLength: number; // default 300
  correctAnswerRequired: boolean; // default false
  correctAnswer: string; // default ""
  numericalResponseRequired: boolean; // default false
  responseDataIdentifier: boolean; // default false
  responseRequired: boolean; // default false
};

export interface ParagraphTextItem extends ActivityItemBase {
  responseType: 'paragraphText';
  config: ParagraphItemConfig;
  responseValues: EmptyResponseValues;
  answer: DefaultAnswer;
}

export type ParagraphItemConfig = ButtonsConfig & {
  maxResponseLength: number; // default 300
  responseDataIdentifier: boolean; // default false
  responseRequired: boolean; // default false
};

export type PhrasalTemplateItemConfig = ButtonsConfig;

export interface CheckboxItem extends ActivityItemBase {
  responseType: 'multiSelect';
  config: CheckboxItemConfig;
  responseValues: CheckboxValues;
  answer: DefaultAnswer;
}

export type CheckboxItemConfig = ButtonsConfig &
  TimerConfig &
  AdditionalResponseConfig & {
    randomizeOptions: boolean;
    addScores: boolean;
    setAlerts: boolean;
    addTooltip: boolean;
    setPalette: boolean;
    portraitLayout: boolean | null;
  };

export type CheckboxValues = {
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

export interface RadioItem extends ActivityItemBase {
  responseType: 'singleSelect';
  config: RadioItemConfig;
  responseValues: RadioValues;
  answer: DefaultAnswer;
}

export type RadioItemConfig = ButtonsConfig &
  TimerConfig &
  AdditionalResponseConfig & {
    randomizeOptions: boolean;
    addScores: boolean;
    setAlerts: boolean;
    addTooltip: boolean;
    setPalette: boolean;
    autoAdvance: boolean;
    portraitLayout: boolean | null;
    responseDataIdentifier: boolean;
  };

export type RadioValues = {
  options: Array<{
    id: string;
    text: string;
    image: string | null;
    score: number | null;
    tooltip: string | null;
    color: string | null;
    isHidden: boolean;
    alert: string | null;
    value: number | string;
  }>;
};

export interface SliderItem extends ActivityItemBase {
  responseType: 'slider';
  config: SliderItemConfig;
  responseValues: SliderValues;
  answer: DefaultAnswer;
}

export type SliderItemConfig = ButtonsConfig &
  TimerConfig &
  AdditionalResponseConfig & {
    addScores: boolean;
    setAlerts: boolean;
    showTickMarks: boolean;
    showTickLabels: boolean;
    continuousSlider: boolean;
  };

export type SliderValues = {
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

export interface SelectorItem extends ActivityItemBase {
  responseType: 'numberSelect';
  config: SelectorItemConfig;
  responseValues: SelectorValues;
  answer: DefaultAnswer;
}

export type SelectorItemConfig = ButtonsConfig & AdditionalResponseConfig;
export type SelectorValues = {
  minValue: number;
  maxValue: number;
};

export interface SplashScreenItem extends ActivityItemBase {
  responseType: 'splashScreen';
  config: SplashScreenItemConfig;
  responseValues: EmptyResponseValues;
  answer: DefaultAnswer;
}

export type SplashScreenItemConfig = ButtonsConfig & {
  imageSrc: string;
};

export interface MessageItem extends ActivityItemBase {
  responseType: 'message';
  config: MessageItemConfig;
  responseValues: EmptyResponseValues;
  answer: DefaultAnswer;
}

export type MessageItemConfig = ButtonsConfig & TimerConfig;

export interface DateItem extends ActivityItemBase {
  responseType: 'date';
  config: DateItemConfig;
  responseValues: EmptyResponseValues;
  answer: DefaultAnswer;
}

export type DateItemConfig = ButtonsConfig & AdditionalResponseConfig & TimerConfig;

export interface TimeItem extends ActivityItemBase {
  responseType: 'time';
  config: TimeItemItemConfig;
  responseValues: EmptyResponseValues;
  answer: DefaultAnswer;
}

export type TimeItemItemConfig = ButtonsConfig & AdditionalResponseConfig & TimerConfig;

export interface TimeRangeItem extends ActivityItemBase {
  responseType: 'timeRange';
  config: TimeRangeItemConfig;
  responseValues: EmptyResponseValues;
  answer: DefaultAnswer;
}

export type TimeRangeItemConfig = ButtonsConfig & AdditionalResponseConfig & TimerConfig;

export interface AudioPlayerItem extends ActivityItemBase {
  responseType: 'audioPlayer';
  config: AudioPlayerItemConfig;
  responseValues: AudioPlayerItemValues;
  answer: DefaultAnswer;
}

export type AudioPlayerItemConfig = ButtonsConfig &
  TimerConfig &
  AdditionalResponseConfig & {
    playOnce: boolean;
  };

export type AudioPlayerItemValues = {
  file: string;
};

export interface MultiSelectionRowsItem extends ActivityItemBase {
  responseType: 'multiSelectRows';
  config: MultiSelectionRowsItemConfig;
  responseValues: MultiSelectionRowsItemResponseValues;
  answer: MatrixMultiSelectAnswer;
}

export type MultiSelectionRowsItemConfig = ButtonsConfig &
  TimerConfig & {
    addScores: boolean;
    setAlerts: boolean;
    addTooltip: boolean;
  };

export type MultiSelectionRowsItemResponseValues = {
  rows: Array<MatrixSelectRow>;
  options: Array<MatrixSelectOption>;
  dataMatrix: DataMatrix;
};

export type MatrixSelectOption = {
  id: string;
  text: string;
  image: string | null;
  tooltip: string | null;
};

export type MatrixSelectRow = {
  id: string;
  rowName: string;
  rowImage: string | null;
  tooltip: string | null;
};

export interface SingleSelectionRowsItem extends ActivityItemBase {
  responseType: 'singleSelectRows';
  config: SingleSelectionRowsItemConfig;
  responseValues: SingleSelectionRowsItemResponseValues;
  answer: SingleMultiSelectAnswer;
}

export type SingleSelectionRowsItemConfig = ButtonsConfig &
  TimerConfig & {
    addScores: boolean;
    setAlerts: boolean;
    addTooltip: boolean;
  };

export type SingleSelectionRowsItemResponseValues = {
  rows: Array<MatrixSelectRow>;
  options: Array<MatrixSelectOption>;
  dataMatrix: DataMatrix;
};

export interface SliderRowsItem extends ActivityItemBase {
  responseType: 'sliderRows';
  config: SliderRowsItemConfig;
  responseValues: SliderRowsItemResponseValues;
  answer: SliderRowsAnswer;
}

export type SliderRowsItemConfig = ButtonsConfig &
  TimerConfig & {
    addScores: boolean;
    setAlerts: boolean;
  };

export type SliderRowsItemResponseValues = {
  rows: SliderRows;
};

export type SliderAlerts = Array<{
  value: number;
  minValue: number;
  maxValue: number;
  alert: string;
}> | null;

export type SliderRows = Array<{
  id: string;
  label: string;
  minLabel: string | null;
  maxLabel: string | null;
  minValue: number;
  maxValue: number;
  minImage: string | null;
  maxImage: string | null;
  alerts: SliderAlerts;
}>;

export interface RequestHealthRecordDataItem extends ActivityItemBase {
  responseType: 'requestHealthRecordData';
  config: RequestHealthRecordDataItemConfig;
  responseValues: RequestHealthRecordDataValues;
  answer: DefaultAnswer;
}

export type RequestHealthRecordDataItemConfig = {
  removeBackButton: boolean;
  skippableItem: never;
};

export type RequestHealthRecordDataValues = {
  type: 'requestHealthRecordData';
  optInOutOptions: [
    {
      id: 'opt_in';
      label: string;
    },
    {
      id: 'opt_out';
      label: string;
    },
  ];
};
