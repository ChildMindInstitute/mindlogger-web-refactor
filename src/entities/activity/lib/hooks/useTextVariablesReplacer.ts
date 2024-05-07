import { MarkdownVariableReplacer } from '../markdownVariableReplacer';
import { Answer } from '../types';

import { appletModel } from '~/entities/applet';
import { RespondentMetaDTO } from '~/shared/api';

type Props = {
  items: appletModel.ItemRecord[];
  answers: Array<Answer>;
  respondentMeta?: RespondentMetaDTO;
  completedEntityTime: number;
};

export const useTextVariablesReplacer = ({
  items,
  answers,
  respondentMeta,
  completedEntityTime,
}: Props) => {
  const replaceTextVariables = (text: string) => {
    if (items && answers) {
      const nickname = respondentMeta?.nickname;

      const replacer = new MarkdownVariableReplacer(items, answers, completedEntityTime, nickname);
      return replacer.process(text);
    }
    return text;
  };

  return { replaceTextVariables };
};
