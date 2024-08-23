import ScoreConditionsEvaluator, { IScoreConditionsEvaluator } from './ScoreConditionsEvaluator';
import ScoresCalculator, { IScoresCalculator } from './ScoresCalculator';
import { ScoreRecord } from '../lib';

import { appletModel } from '~/entities/applet';
import { ReportDTO } from '~/shared/api';

class ScoresExtractor {
  private conditionsEvaluator: IScoreConditionsEvaluator;

  private scoresCalculator: IScoresCalculator;

  constructor(conditionsEvaluator: IScoreConditionsEvaluator, scoresCalculator: IScoresCalculator) {
    this.conditionsEvaluator = conditionsEvaluator;
    this.scoresCalculator = scoresCalculator;
  }

  private extractInternal(
    items: appletModel.ItemRecord[],
    scoreSettings: ReportDTO,
  ): ScoreRecord | null {
    const score: number | null = this.scoresCalculator.calculate(items, scoreSettings);

    if (score === null) {
      return null;
    }

    const fixedScore = Number(score.toFixed(2));

    const conditionLogicResults: Array<boolean> = scoreSettings.conditionalLogic
      .filter((x) => x.flagScore)
      .map((conditions) => this.conditionsEvaluator.evaluate(conditions, fixedScore));

    return {
      name: scoreSettings.type === 'score' ? scoreSettings.name : '',
      value: fixedScore,
      flagged: conditionLogicResults.some((x) => x),
    };
  }

  public extract(items: appletModel.ItemRecord[], settings: Array<ReportDTO>): Array<ScoreRecord> {
    const result: Array<ScoreRecord> = [];

    for (const scoreSettings of settings) {
      try {
        const score: ScoreRecord | null = this.extractInternal(items, scoreSettings);

        if (score !== null) {
          result.push(score);
        }
      } catch (error) {
        console.error('[ScoresExtractor:extract] Error occurred', error);
        result.push({
          name: '[Error occurred]',
          value: 0,
          flagged: false,
        });
      }
    }

    return result;
  }
}

export default new ScoresExtractor(ScoreConditionsEvaluator, ScoresCalculator);
