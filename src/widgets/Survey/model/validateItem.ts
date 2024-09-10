import { hasAdditionalResponse, requiresAdditionalResponse } from '~/entities/activity/lib/helpers';
import { appletModel } from '~/entities/applet';
import { ActivityDTO } from '~/shared/api';
import { AudioPlayerFinished } from '~/shared/ui/Items/AudioPlayer/lib';
import { stringContainsOnlyNumbers, validateDate, validateTime } from '~/shared/utils';

function isAnswerShouldBeEmpty(item: appletModel.ItemRecord) {
  const isMessageItem = item.responseType === 'message';
  const isAudioPlayerItem = item.responseType === 'audioPlayer';

  const isItemWithoutAnswer = isMessageItem || isAudioPlayerItem;

  return isItemWithoutAnswer;
}

function isAnswerShouldBeNumeric(item: appletModel.ItemRecord) {
  const isTextItem = item.responseType === 'text';

  if (!isTextItem) {
    return false;
  }

  const isNumericOnly = item.config.numericalResponseRequired;

  if (isNumericOnly) {
    return !stringContainsOnlyNumbers(item.answer[0]);
  }

  return false;
}

function isAnswerTooLarge(item: appletModel.ItemRecord) {
  if (
    !['paragraphText', 'text'].includes(item.responseType) ||
    !('maxResponseLength' in item.config) ||
    typeof item.answer[0] !== 'string'
  ) {
    return false;
  }
  return item.answer[0].length > item.config.maxResponseLength ?? true;
}

function isAnswerEmpty(item: appletModel.ItemRecord): boolean {
  if (item.responseType === 'timeRange') {
    const fromTime = Date.parse(item.answer[0]);
    const toTime = Date.parse(item.answer[1]);

    return Boolean(fromTime) && Boolean(toTime);
  }

  if (item.responseType === 'multiSelectRows') {
    if (item.answer === null || item.answer.length === 0) return false;

    return item.answer.every((row) => row.some((e) => e !== null));
  }

  if (item.responseType === 'singleSelectRows') {
    if (item.answer === null || item.answer.length === 0) return false;

    return item.answer.every((value) => value !== null);
  }

  if (item.responseType === 'sliderRows') {
    if (item.answer === null || item.answer.length === 0) return false;

    return item.answer.every((value) => value !== null);
  }

  return item.answer.length > 0;
}

function checkAudioPlayer(item: appletModel.ItemRecord): boolean {
  if (item.responseType === 'audioPlayer') {
    return item.answer[0] === AudioPlayerFinished;
  }

  return true;
}

function validateResponseCorrectness(item: appletModel.ItemRecord): boolean {
  if (item.responseType === 'date') {
    return validateDate(new Date(item.answer[0]));
  }

  if (item.responseType === 'time') {
    return validateTime(new Date(item.answer[0]));
  }

  if (item.responseType === 'timeRange') {
    const isFromTimeValid = validateTime(new Date(item.answer[0]));
    const isToTimeValid = validateTime(new Date(item.answer[1]));

    return isFromTimeValid && isToTimeValid;
  }

  if (item.responseType === 'text' && item.config.correctAnswerRequired) {
    const isAnswerCorrect = item.answer[0] === item.config.correctAnswer;

    return isAnswerCorrect;
  }

  return true;
}

type ValidateItemProps = {
  item: appletModel.ItemRecord;
  showWarning: (translationKey: string) => void;
  hideWarning: () => void;
  activity: ActivityDTO;
};

export function validateBeforeMoveForward({
  item,
  activity,
  showWarning,
  hideWarning,
}: ValidateItemProps): boolean {
  const isSkippable = item.config.skippableItem || activity.isSkippable;

  if (isSkippable) {
    hideWarning();
    return true;
  }

  const shouldBeEmpty = isAnswerShouldBeEmpty(item);
  const isEmpty = isAnswerEmpty(item);
  const isTooLarge = isAnswerTooLarge(item);

  if (!shouldBeEmpty && !isEmpty) {
    showWarning('pleaseAnswerTheQuestion');
    return false;
  }

  const isAnswerCorrect = validateResponseCorrectness(item);

  if (!isAnswerCorrect) {
    showWarning('incorrect_answer');
    return false;
  }

  const isNumericOnly = isAnswerShouldBeNumeric(item);

  if (isNumericOnly) {
    showWarning('onlyNumbersAllowed');
    return false;
  }

  if (isTooLarge) {
    showWarning('answerTooLarge');
    return false;
  }

  const hasAdditionalTextField = hasAdditionalResponse(item);
  const isAdditionalTextRequired = hasAdditionalTextField && requiresAdditionalResponse(item);
  const isAdditionalTextEmpty = hasAdditionalTextField && !item.additionalText;

  if (isAdditionalTextRequired && isAdditionalTextEmpty) {
    showWarning('pleaseProvideAdditionalText');
    return false;
  }

  const audioIsNotFinished = !checkAudioPlayer(item);

  if (audioIsNotFinished) {
    showWarning('pleaseListenToAudio');
    return false;
  }

  hideWarning();
  return true;
}
