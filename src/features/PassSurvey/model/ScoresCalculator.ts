import { CheckboxItem, RadioItem, SliderItem } from '~/entities/activity';
import { appletModel } from '~/entities/applet';
import { ReportDTO, ReportScoreDTO } from '~/shared/api';
import { Calculator } from '~/shared/utils';

type ItemRecord = appletModel.ItemRecord;

export interface IScoresCalculator {
  calculate(items: ItemRecord[], settings: ReportDTO): number | null;
}

export class ScoresCalculator implements IScoresCalculator {
  private collectScoreForRadio(radioItem: RadioItem): number | null {
    const radioAnswer = radioItem.answer[0] ? Number(radioItem.answer[0]) : null;

    if (radioAnswer === null) {
      return null;
    }

    const option = radioItem.responseValues.options.find((o) => o.value === radioAnswer);

    return option ? option.score : null;
  }

  private collectScoreForCheckboxes(checkboxItem: CheckboxItem): number | null {
    const checkboxAnswers = checkboxItem.answer;

    if (checkboxAnswers.length === 0) {
      return null;
    }

    const scores: number[] = checkboxItem.responseValues.options
      .map<number | null>((option) => {
        const foundAnswer = checkboxAnswers?.find((checkboxAnswer) => {
          return Number(checkboxAnswer) === option.value;
        });

        return foundAnswer ? option.score : null;
      })
      .filter((x) => x !== null)
      .map((x) => x!);

    return Calculator.sum(scores);
  }

  private collectScoreForSlider(sliderItem: SliderItem): number | null {
    const sliderAnswer: number | null = sliderItem.answer[0] ? Number(sliderItem.answer[0]) : null;

    if (sliderAnswer === null) {
      return null;
    }

    if (
      sliderAnswer < sliderItem.responseValues.minValue ||
      sliderAnswer > sliderItem.responseValues.maxValue
    ) {
      return null;
    }

    const isFloat = Math.floor(sliderAnswer) !== sliderAnswer;

    if (isFloat) {
      return null;
    }

    const valueIndex = sliderAnswer - sliderItem.responseValues.minValue;

    const scores: number[] = sliderItem.responseValues.scores ?? [];

    return scores[valueIndex] ?? null;
  }

  private collectScoreForItem(item: ItemRecord): number | null {
    if (item.answer === null || item.answer.length === 0) {
      return null;
    }

    switch (item.responseType) {
      case 'slider':
        return this.collectScoreForSlider(item);
      case 'singleSelect':
        return this.collectScoreForRadio(item);
      case 'multiSelect':
        return this.collectScoreForCheckboxes(item);
      default:
        return null;
    }
  }

  private collectActualScores(items: ItemRecord[], selectedItems: string[]): Array<number | null> {
    const scores: Array<number | null> = items.map((item: ItemRecord) => {
      if (!selectedItems.includes(item.name)) {
        return null;
      }

      const result: number | null = this.collectScoreForItem(item);

      return result;
    });

    return scores;
  }

  private collectMaxScoresInternal(
    items: ItemRecord[],
    selectedItems: string[],
  ): Array<number | null> {
    const scores: Array<number | null> = items.map((item: ItemRecord) => {
      if (!selectedItems.includes(item.name)) {
        return null;
      }

      switch (item.responseType) {
        case 'singleSelect': {
          const allScores = item.responseValues.options
            .map((x) => x.score)
            .filter((x) => x !== null)
            .map((x) => x!);
          return Math.max(...allScores);
        }
        case 'multiSelect': {
          const allScores = item.responseValues.options
            .map((x) => x.score)
            .filter((x) => x !== null)
            .map((x) => x!);
          return Calculator.sum(allScores);
        }
        case 'slider': {
          if (!item.responseValues.scores?.some((x) => x >= 0)) {
            return null;
          }
          return Math.max(...item.responseValues.scores);
        }
        default:
          return null;
      }
    });

    return scores;
  }

  private collectMaxScores(
    pipelineItems: ItemRecord[],
    selectedItems: string[],
  ): Array<number | null> {
    try {
      return this.collectMaxScoresInternal(pipelineItems, selectedItems);
    } catch (error) {
      throw new Error(`[ScoresCalculator:collectMaxScores]: Error occurred:\n\n${error}`);
    }
  }

  public calculate(items: ItemRecord[], reportSettings: ReportDTO): number | null {
    let scores: Array<number | null>;

    const settings: ReportScoreDTO | null = reportSettings.type === 'score' ? reportSettings : null;

    if (settings === null) {
      return null;
    }

    try {
      scores = this.collectActualScores(items, settings.itemsScore);
    } catch (error) {
      throw new Error(
        `[ScoresCalculator.calculate]: Error occurred during collecting actual scores:\n\n${error}`,
      );
    }

    const filteredScores: number[] = scores.filter((x) => x !== null).map((x) => x!);

    if (!filteredScores.length) {
      return null;
    }

    switch (settings.calculationType) {
      case 'average':
        return Calculator.avg(filteredScores);
      case 'sum':
        return Calculator.sum(filteredScores);
      case 'percentage': {
        const maxScores = this.collectMaxScores(items, settings.itemsScore);

        const filteredMaxScores = maxScores.filter((x) => x !== null).map((x) => x!);

        const currentScore = Calculator.sum(filteredScores);
        const sumOfMaxScores = Calculator.sum(filteredMaxScores);

        if (sumOfMaxScores === 0) {
          return 0;
        }

        return (100 * currentScore) / sumOfMaxScores;
      }
      default:
        return null;
    }
  }
}

export default new ScoresCalculator();
