import { AudioPlayerItem } from './AudioPlayerItem';
import { CheckboxItem } from './CheckboxItem';
import { DateItem } from './DateItem';
import { MatrixCheckboxItem } from './Matrix/MatrixMultiSelectItem';
import { MatrixRadioItem } from './Matrix/MatrixSingleSelectItem';
import { SliderRows } from './Matrix/Slider';
import { ParagraphTextItem } from './ParagraphTextItem';
import { RadioItem } from './RadioItem';
import { SelectorItem } from './SelectorItem';
import { SliderItem } from './SliderItem';
import { SplashScreen } from './SplashScreen';
import { TextItem } from './TextItem';
import { TimeItem } from './TimeItem';
import { TimeRangeItem } from './TimeRangeItem';
import { Answer } from '../../lib';

import { ItemRecord } from '~/entities/applet/model/types';

type ItemPickerProps = {
  item: ItemRecord;

  onValueChange: (value: Answer) => void;
  isDisabled: boolean;
  replaceText: (value: string) => string;
};

export const ItemPicker = ({ item, onValueChange, isDisabled, replaceText }: ItemPickerProps) => {
  switch (item.responseType) {
    case 'splashScreen':
      return <SplashScreen imageSrc={item.config.imageSrc} />;

    case 'text':
      return (
        <TextItem
          item={item}
          value={item.answer[0]}
          onValueChange={onValueChange}
          isDisabled={isDisabled}
        />
      );

    case 'paragraphText':
      return (
        <ParagraphTextItem
          item={item}
          value={item?.answer?.[0]}
          onValueChange={onValueChange}
          isDisabled={isDisabled}
        />
      );

    case 'multiSelect':
      return (
        <CheckboxItem
          item={item}
          values={item.answer}
          onValueChange={onValueChange}
          isDisabled={isDisabled}
          replaceText={replaceText}
        />
      );

    case 'singleSelect':
      return (
        <RadioItem
          item={item}
          value={item.answer[0]}
          onValueChange={onValueChange}
          isDisabled={isDisabled}
          replaceText={replaceText}
        />
      );

    case 'slider':
      return (
        <SliderItem
          item={item}
          value={item.answer[0]}
          onValueChange={onValueChange}
          isDisabled={isDisabled}
        />
      );

    case 'numberSelect':
      return (
        <SelectorItem
          item={item}
          value={item.answer[0]}
          onValueChange={onValueChange}
          isDisabled={isDisabled}
        />
      );

    case 'message':
      return <></>;

    case 'date':
      return <DateItem value={item.answer[0]} onValueChange={onValueChange} />;

    case 'time':
      return <TimeItem value={item.answer[0]} onValueChange={onValueChange} />;

    case 'timeRange':
      return <TimeRangeItem values={item.answer} onValueChange={onValueChange} />;

    case 'audioPlayer':
      return <AudioPlayerItem item={item} value={item.answer[0]} onValueChange={onValueChange} />;

    case 'multiSelectRows':
      return (
        <MatrixCheckboxItem
          item={item}
          values={item.answer}
          onValueChange={onValueChange}
          replaceText={replaceText}
        />
      );

    case 'singleSelectRows':
      return (
        <MatrixRadioItem
          item={item}
          values={item.answer}
          onValueChange={onValueChange}
          replaceText={replaceText}
        />
      );

    case 'sliderRows':
      return <SliderRows item={item} values={item.answer} onValueChange={onValueChange} />;

    default:
      return <></>;
  }
};
