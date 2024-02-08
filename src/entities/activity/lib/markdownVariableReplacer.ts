import { format, intervalToDuration, isSameDay, addDays } from 'date-fns';

import { Answer, Answers } from '~/abstract/lib';
import { ItemRecord } from '~/entities/applet/model/types';

export class MarkdownVariableReplacer {
  private readonly activityItems: ItemRecord[];
  private readonly answers: Answers;
  private readonly nickName: string;
  private readonly lastResponseTime: Date | number | null;
  private readonly now: number;

  constructor(activityItems: ItemRecord[], answers: Answers, lastResponseTime: Date | number | null, nickName = '') {
    this.activityItems = activityItems;
    this.answers = answers;
    this.nickName = nickName;
    this.lastResponseTime = lastResponseTime;
    this.now = Date.now();
  }

  private extractVariables = (markdown: string): string[] => {
    const regEx = /\[\[(.*?)]]/g;
    const matches = [];
    let found;
    while ((found = regEx.exec(markdown))) {
      matches.push(found[1]);
    }
    return matches;
  };

  private parseBasicSystemVariables = (markdown: string) => {
    return markdown
      .replaceAll(/\[Now]/gi, `${format(this.now, 'h:mm aa')} today (now)`)
      .replaceAll(/\[Nickname]/gi, this.nickName)
      .replaceAll(/\[sys.date]/gi, format(this.now, 'MM/dd/y'));
  };

  private cleanUpUnusedResponseVariables = (markdown: string) => {
    return markdown
      .replaceAll(/\[Time_Elapsed_Activity_Last_Completed]/gi, '')
      .replaceAll(/\[Time_Activity_Last_Completed]/gi, '');
  };

  public parseSystemVariables = (markdown: string) => {
    if (!this.lastResponseTime) {
      const cleanedUpMarkdown = this.cleanUpUnusedResponseVariables(markdown);
      return this.parseBasicSystemVariables(cleanedUpMarkdown);
    }

    markdown = markdown.replaceAll(
      /\[Time_Activity_Last_Completed] to \[Now]/gi,
      '[blue][Time_Activity_Last_Completed] to [Now]',
    );

    return this.parseBasicSystemVariables(markdown)
      .replaceAll(/\[Time_Elapsed_Activity_Last_Completed]/gi, this.getTimeElapsed())
      .replaceAll(/\[Time_Activity_Last_Completed]/gi, this.getLastResponseTime());
  };

  private preprocessImageLinks = (markdown: string) => {
    return markdown.replace(/(!\[.*\]\s*\(.*?) =\d*x\d*(\))/g, '$1$2');
  };

  private getTimeElapsed = () => {
    const interval = intervalToDuration({
      start: this.lastResponseTime!,
      end: this.now,
    });
    let formattedString = '';

    if (interval.minutes) {
      formattedString = `${interval.minutes} minutes`;
    }
    if (interval.hours) {
      formattedString = `${interval.hours} hours and ${formattedString}`;
    }
    if (interval.days) {
      formattedString = `${interval.days} days and ${formattedString}`;
    }
    if (interval.months) {
      formattedString = `${interval.months} months and ${formattedString}`;
    }

    if (interval.seconds && formattedString === '') {
      formattedString = 'minute';
    }

    return formattedString;
  };

  private getLastResponseTime = () => {
    if (isSameDay(this.now, this.lastResponseTime!)) {
      return `${format(this.lastResponseTime!, 'hh:mm aa')} today`;
    } else if (isSameDay(addDays(this.lastResponseTime!, 1), this.now)) {
      return `${format(this.lastResponseTime!, 'hh:mm aa')} yesterday`;
    }
    return format(this.lastResponseTime!, 'hh:mm aa dd/MM/y');
  };

  private updateMarkdown = (variableName: string, replaceValue: string, markdown: string) => {
    const reg = new RegExp(`\\[\\[${variableName}\\]\\]`, 'gi');
    return markdown.replace(reg, replaceValue);
  };

  public process = (markdown: string): string => {
    let updatedMarkdown = markdown;

    const variableNames = this.extractVariables(updatedMarkdown);

    try {
      variableNames.forEach(variableName => {
        const replaceValue = this.getReplaceValue(variableName);
        updatedMarkdown = this.updateMarkdown(variableName, replaceValue, markdown);
      });
    } catch (error) {
      /* eslint-disable no-console */
      console.warn(error);
    }

    const nestingVariableNames = this.extractVariables(updatedMarkdown);

    if (nestingVariableNames.length) {
      updatedMarkdown = this.process(updatedMarkdown);
    }

    updatedMarkdown = this.parseSystemVariables(updatedMarkdown);

    updatedMarkdown = this.preprocessImageLinks(updatedMarkdown);

    return updatedMarkdown;
  };

  private escapeSpecialChars = (value: Answer) => {
    return value.toString().replace(/(?=[$&])/g, '\\');
  };

  private getReplaceValue = (variableName: string): string => {
    const foundIndex = this.activityItems.findIndex(item => item.name === variableName);
    const answerNotFound = foundIndex < 0 || !this.answers[foundIndex];

    if (answerNotFound) {
      return '';
    }

    const activityItem = this.activityItems[foundIndex];
    let updated = '';
    const answer = this.answers[foundIndex];

    switch (activityItem.responseType) {
      case 'slider':
      case 'numberSelect':
      case 'text':
        updated = this.escapeSpecialChars(answer);
        break;
      case 'singleSelect':
        const filteredItem = activityItem.responseValues.options.find(({ value }) => answer.includes(String(value)));
        if (filteredItem) {
          updated = filteredItem.text;
        }
        break;
      case 'multiSelect':
        const filteredItems = activityItem.responseValues.options
          .filter(({ value }) => answer.includes(String(value)))
          .map(({ text }) => text);

        if (filteredItems) {
          updated = filteredItems.toString();
        }
        break;
    }
    return updated;
  };
}
