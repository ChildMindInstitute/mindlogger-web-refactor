import { ItemAnswer } from './itemAnswer';

import { AnswerTypesPayload } from '~/shared/api';

type PreparedItemAnswers = {
  answer: AnswerTypesPayload[];
  itemIds: string[];
};

export const prepareItemAnswers = (
  itemAnswers: Array<ItemAnswer<AnswerTypesPayload>>,
): PreparedItemAnswers => {
  return itemAnswers.reduce(
    (acc, itemAnswer) => {
      if (itemAnswer) {
        acc.answer.push(itemAnswer.answer);
        acc.itemIds.push(itemAnswer.itemId);
      }

      return acc;
    },
    {
      answer: [],
      itemIds: [],
    } as PreparedItemAnswers,
  );
};
