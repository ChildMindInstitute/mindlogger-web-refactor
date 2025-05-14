import { ItemRecord, UserEventResponse } from './types';

import { RequestHealthRecordDataItemStep } from '~/entities/activity';
import { ActivityItemDetailsDTO } from '~/shared/api';
import { dateToDayMonthYear, dateToHourMinute } from '~/shared/utils';

export const mapItemAnswerToUserEventResponse = (item: ItemRecord): UserEventResponse => {
  const responseType = item.responseType;

  if (responseType === 'singleSelect') {
    return {
      value: [Number(item.answer[0])],
      text: item.additionalText ?? undefined,
    };
  }

  if (responseType === 'multiSelect') {
    return {
      value: item.answer.map((answer) => Number(answer)),
      text: item.additionalText ?? undefined,
    };
  }

  if (responseType === 'date') {
    return {
      value: dateToDayMonthYear(new Date(item.answer[0])),
      text: item.additionalText ?? undefined,
    };
  }

  if (responseType === 'time') {
    return {
      value: dateToHourMinute(new Date(item.answer[0])),
      text: item.additionalText ?? undefined,
    };
  }

  if (responseType === 'timeRange') {
    const fromDate = item.answer[0] ? new Date(item.answer[0]) : new Date();
    const toDate = item.answer[1] ? new Date(item.answer[1]) : new Date();

    return {
      value: {
        from: { hour: fromDate.getHours(), minute: fromDate.getMinutes() },
        to: { hour: toDate.getHours(), minute: toDate.getMinutes() },
      },
      text: item.additionalText ?? undefined,
    };
  }

  if (responseType === 'audioPlayer') {
    return {
      value: true,
      text: item.additionalText ?? undefined,
    };
  }

  if (responseType === 'singleSelectRows') {
    const value: Array<string | null> = item.answer.map((answer) => {
      if (answer === null) return answer;

      const option = item.responseValues.options.find((option) => option.id === answer);

      return option?.text ?? answer;
    });

    return {
      value,
      text: item.additionalText ?? undefined,
    };
  }

  return {
    value: item.answer,
    text: item.additionalText ?? undefined,
  };
};

export function mapItemToRecord(item: ActivityItemDetailsDTO): ItemRecord {
  switch (item.responseType) {
    case 'message':
      return {
        ...item,
        config: {
          ...item.config,
          skippableItem: false,
        },
        answer: [],
      };

    case 'requestHealthRecordData':
      return {
        ...item,
        subStep: RequestHealthRecordDataItemStep.ConsentPrompt,
        additionalEHRs: null,
        answer: [],
      };

    default:
      return {
        ...item,
        answer: [],
      };
  }
}

export function mapSplashScreenToRecord(splashScreen: string): ItemRecord {
  return {
    id: splashScreen,
    name: '',
    question: '',
    order: 0,
    responseType: 'splashScreen',
    config: {
      removeBackButton: true,
      skippableItem: true,
      imageSrc: splashScreen,
    },
    responseValues: null,
    answer: [],
    conditionalLogic: null,
    isHidden: false,
  };
}
