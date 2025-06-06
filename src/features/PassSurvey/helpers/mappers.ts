import {
  AudioPlayerItem,
  CheckboxItem,
  DateItem,
  MessageItem,
  MultiSelectionRowsItem,
  ParagraphTextItem,
  RadioItem,
  RequestHealthRecordDataItem,
  SelectorItem,
  SingleSelectionRowsItem,
  SliderItem,
  SliderRowsItem,
  TextItem,
  TimeItem,
  TimeRangeItem,
} from '~/entities/activity';
import { appletModel } from '~/entities/applet';
import { ItemAnswer } from '~/features/PassSurvey/helpers/itemAnswer';
import {
  AlertDTO,
  AnswerTypesPayload,
  AudioPlayerAnswerPayload,
  DateAnswerPayload,
  MatrixMultiSelectAnswerPayload,
  MessageAnswerPayload,
  MultiSelectAnswerPayload,
  NumberSelectAnswerPayload,
  ParagraphAnswerPayload,
  SingleSelectAnswerPayload,
  SliderAnswerPayload,
  TextAnswerPayload,
  TimeAnswerPayload,
  TimeRangeAnswerPayload,
} from '~/shared/api';
import { dateToDayMonthYear, dateToHourMinute, isExist } from '~/shared/utils';

export function mapToAnswers(
  items: Array<appletModel.ItemRecord>,
): Array<ItemAnswer<AnswerTypesPayload>> {
  const answers = items.map((item) => {
    switch (item.responseType) {
      case 'text':
        return convertToTextAnswer(item);

      case 'paragraphText':
        return convertToParagraphTextAnswer(item);

      case 'singleSelect':
        return convertToSingleSelectAnswer(item);

      case 'multiSelect':
        return convertToMultiSelectAnswer(item);

      case 'slider':
        return convertToSliderAnswer(item);

      case 'numberSelect':
        return convertToNumberSelectAnswer(item);

      case 'message':
        return convertToMessageAnswer(item);

      case 'date':
        return convertToDateAnswer(item);

      case 'time':
        return convertToTimeAnswer(item);

      case 'timeRange':
        return convertToTimeRangeAnswer(item);

      case 'audioPlayer':
        return convertToAudioPlayerAnswer(item);

      case 'multiSelectRows':
        return convertToMatrixMultiSelectAnswer(item);

      case 'singleSelectRows':
        return convertToMatrixSingleSelectAnswer(item);

      case 'sliderRows':
        return convertToSliderRowsAnswer(item);

      case 'requestHealthRecordData':
        return convertToRequestHealthRecordDataAnswer(item);

      default:
        return null;
    }
  });

  return answers as Array<ItemAnswer<AnswerTypesPayload>>;
}

function convertToTextAnswer(item: TextItem): ItemAnswer<TextAnswerPayload> {
  if (!item.answer[0]) {
    return {
      answer: null,
      itemId: item.id,
    };
  }

  return {
    answer: item.answer[0],
    itemId: item.id,
  };
}

function convertToParagraphTextAnswer(item: ParagraphTextItem): ItemAnswer<ParagraphAnswerPayload> {
  if (!item.answer[0]) {
    return {
      answer: null,
      itemId: item.id,
    };
  }

  return {
    answer: item.answer[0],
    itemId: item.id,
  };
}

function convertToSingleSelectAnswer(item: RadioItem): ItemAnswer<SingleSelectAnswerPayload> {
  if (!item.answer[0]) {
    return {
      answer: null,
      itemId: item.id,
    };
  }

  return {
    answer: {
      value: Number(item.answer[0]),
      text: item.additionalText || null,
    },
    itemId: item.id,
  };
}

function convertToMultiSelectAnswer(item: CheckboxItem): ItemAnswer<MultiSelectAnswerPayload> {
  if (!item.answer[0]) {
    return {
      answer: null,
      itemId: item.id,
    };
  }

  return {
    answer: {
      value: item.answer.map((strValue) => Number(strValue)),
      text: item.additionalText || null,
    },
    itemId: item.id,
  };
}

function convertToSliderAnswer(item: SliderItem): ItemAnswer<SliderAnswerPayload> {
  if (!item.answer[0]) {
    return {
      answer: null,
      itemId: item.id,
    };
  }

  return {
    answer: {
      value: Number(item.answer[0]),
      text: item.additionalText || null,
    },
    itemId: item.id,
  };
}

function convertToNumberSelectAnswer(item: SelectorItem): ItemAnswer<NumberSelectAnswerPayload> {
  if (!isExist(item.answer[0])) {
    return {
      answer: null,
      itemId: item.id,
    };
  }

  return {
    answer: {
      value: Number(item.answer[0]),
      text: item.additionalText || null,
    },
    itemId: item.id,
  };
}

function convertToMessageAnswer(item: MessageItem): ItemAnswer<MessageAnswerPayload> {
  return {
    answer: null,
    itemId: item.id,
  };
}

function convertToDateAnswer(item: DateItem): ItemAnswer<DateAnswerPayload> {
  if (!item.answer[0]) {
    return {
      answer: null,
      itemId: item.id,
    };
  }

  return {
    answer: {
      value: dateToDayMonthYear(new Date(item.answer[0])),
      text: item.additionalText || null,
    },
    itemId: item.id,
  };
}

function convertToTimeAnswer(item: TimeItem): ItemAnswer<TimeAnswerPayload> {
  if (!item.answer[0]) {
    return {
      answer: null,
      itemId: item.id,
    };
  }

  return {
    answer: {
      value: dateToHourMinute(new Date(item.answer[0])),
      text: item.additionalText || null,
    },
    itemId: item.id,
  };
}

function convertToTimeRangeAnswer(item: TimeRangeItem): ItemAnswer<TimeRangeAnswerPayload> {
  if (!item.answer[0]) {
    return {
      answer: null,
      itemId: item.id,
    };
  }

  const fromDate = new Date(item.answer[0]);
  const toDate = new Date(item.answer[1]);

  return {
    answer: {
      value: {
        from: { hour: fromDate.getHours(), minute: fromDate.getMinutes() },
        to: { hour: toDate.getHours(), minute: toDate.getMinutes() },
      },
      text: item.additionalText || null,
    },
    itemId: item.id,
  };
}

function convertToAudioPlayerAnswer(item: AudioPlayerItem): ItemAnswer<AudioPlayerAnswerPayload> {
  if (!item.answer[0]) {
    return {
      answer: null,
      itemId: item.id,
    };
  }

  return {
    answer: {
      value: true,
      text: item.additionalText || null,
    },
    itemId: item.id,
  };
}

function convertToMatrixMultiSelectAnswer(
  item: MultiSelectionRowsItem,
): ItemAnswer<MatrixMultiSelectAnswerPayload> {
  return {
    answer: {
      value: item.answer,
      text: item.additionalText || null,
    },
    itemId: item.id,
  };
}

function convertToMatrixSingleSelectAnswer(item: SingleSelectionRowsItem) {
  const answers = item.answer.map((answer) => {
    const isAnswerExist = answer !== null;
    const optionName = item.responseValues.options.find((el) => el.id === answer)?.text;

    if (!isAnswerExist || !optionName) {
      return null;
    }

    return optionName;
  });

  return {
    answer: {
      value: answers,
      text: item.additionalText || null,
    },
    itemId: item.id,
  };
}

function convertToSliderRowsAnswer(item: SliderRowsItem) {
  if (item.answer.length === 0) {
    return {
      answer: null,
      itemId: item.id,
    };
  }

  return {
    answer: {
      value: item.answer,
      text: item.additionalText || null,
    },
    itemId: item.id,
  };
}

function convertToRequestHealthRecordDataAnswer(item: RequestHealthRecordDataItem) {
  if (!item.answer[0]) {
    return {
      answer: null,
      itemId: item.id,
    };
  }

  return {
    answer: {
      value: item.answer[0],
    },
    itemId: item.id,
  };
}

export function mapAlerts(items: Array<appletModel.ItemRecord>): Array<AlertDTO> {
  const alerts = items.map((item) => {
    switch (item.responseType) {
      case 'singleSelect':
        return convertSingleSelectToAlert(item);

      case 'multiSelect':
        return convertMultiSelectToAlert(item);

      case 'slider':
        return convertSliderToAlert(item);

      case 'sliderRows':
        return convertSliderRowsToAlert(item);

      case 'multiSelectRows':
        return convertMultiRowsToAlert(item);

      case 'singleSelectRows':
        return convertSingleRowsToAlert(item);

      default:
        return null;
    }
  });

  return alerts.filter((alert) => alert !== null).flat() as Array<AlertDTO>;
}

function convertSingleSelectToAlert(item: RadioItem): Array<AlertDTO> {
  const alert: Array<AlertDTO> = [];

  if (item.config.setAlerts && item.answer.length > 0) {
    const option = item.responseValues.options.find(
      (option) => option.value === Number(item.answer[0]),
    );

    if (option && option.alert) {
      alert.push({
        activityItemId: item.id,
        message: option.alert,
      });
    }
  }

  return alert;
}

function convertMultiSelectToAlert(item: CheckboxItem): Array<AlertDTO> {
  const alert: Array<AlertDTO> = [];

  if (item.config.setAlerts && item.answer.length > 0) {
    item.responseValues.options.forEach((option) => {
      const answeredOption = item.answer.includes(String(option.value));

      if (answeredOption && option.alert) {
        alert.push({
          activityItemId: item.id,
          message: option.alert,
        });
      }
    });
  }

  return alert;
}

function convertSliderToAlert(item: SliderItem): Array<AlertDTO> {
  const alert: Array<AlertDTO> = [];

  if (item.config.setAlerts && item.answer.length > 0) {
    item.responseValues.alerts?.forEach((alertItem) => {
      const answer = Number(item.answer[0]);

      if (alertItem.minValue < answer && alertItem.maxValue > answer) {
        alert.push({
          activityItemId: item.id,
          message: alertItem.alert,
        });
      }

      if (!alertItem.minValue && !alertItem.maxValue && alertItem.value === answer) {
        alert.push({
          activityItemId: item.id,
          message: alertItem.alert,
        });
      }
    });
  }

  return alert;
}

function convertSliderRowsToAlert(item: SliderRowsItem): Array<AlertDTO> {
  const alerts: Array<AlertDTO> = [];

  if (item.config.setAlerts && item.answer.length > 0) {
    item.responseValues.rows.forEach((row, rowIndex) => {
      if (row.alerts) {
        row.alerts.forEach((alert) => {
          if (alert.value === item.answer[rowIndex]) {
            alerts.push({
              activityItemId: item.id,
              message: alert.alert,
            });
          }
        });
      }
    });
  }

  return alerts;
}

function convertMultiRowsToAlert(item: MultiSelectionRowsItem): Array<AlertDTO> {
  const alerts: Array<AlertDTO> = [];

  if (item.config.setAlerts && item.answer.length > 0) {
    item.responseValues.dataMatrix.forEach((row, rowIndex) => {
      const columnAnswers = item.answer[rowIndex];

      if (columnAnswers?.length) {
        row.options.forEach((option) => {
          const optionText = item.responseValues.options.find(
            (el) => el.id === option.optionId,
          )?.text;

          columnAnswers.forEach((cellAnswer) => {
            if (cellAnswer === optionText && option.alert) {
              alerts.push({
                activityItemId: item.id,
                message: option.alert,
              });
            }
          });
        });
      }
    });
  }

  return alerts;
}

function convertSingleRowsToAlert(item: SingleSelectionRowsItem): Array<AlertDTO> {
  const alerts: Array<AlertDTO> = [];

  if (item.config.setAlerts && item.answer.length > 0) {
    item.responseValues.dataMatrix.forEach((row) => {
      row.options.forEach((option, optionIndex) => {
        item.answer.forEach((itemAnswer, answerIndex) => {
          if (itemAnswer === option.optionId && optionIndex === answerIndex && option.alert) {
            alerts.push({
              activityItemId: item.id,
              message: option.alert,
            });
          }
        });
      });
    });
  }

  return alerts;
}
