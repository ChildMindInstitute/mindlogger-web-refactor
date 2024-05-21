import { useCallback, useMemo } from 'react';

import { ActivityOrFlowProgress, ActivityScore, getProgressId } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { PassSurveyModel } from '~/features/PassSurvey';
import { AnswerAlerts, ScoreRecord } from '~/features/PassSurvey/lib';
import { ScoreAndReports } from '~/shared/api';
import { useAppSelector } from '~/shared/utils';

type Props = {
  activityId: string;
  activityName: string;
  eventId: string;
  flowId?: string;

  scoresAndReports: ScoreAndReports;
};

export type UIScore = {
  label: string;
  value: number;
  highlighted: boolean;
};

export type UIActivityScores = {
  activityName: string;
  scores: Array<UIScore>;
};

export type UISummaryData = {
  alerts: string[];
  scores: UIActivityScores[];
};

export const useSummaryData = (props: Props) => {
  const { getGroupProgress } = appletModel.hooks.useGroupProgressState();

  const progressId = getProgressId(props.activityId, props.eventId);

  const activityProgress = useAppSelector((state) =>
    appletModel.selectors.selectActivityProgress(state, progressId),
  );

  const getSummaryForCurrentActivity = useCallback(() => {
    if (!props.scoresAndReports?.showScoreSummary) {
      return { alerts: [], scores: [] };
    }

    const items = activityProgress.items;
    const reportSettings = props.scoresAndReports;

    const extractedAlerts: AnswerAlerts = PassSurveyModel.AlertsExtractor.extractForSummary(items);

    const scoreRecords: Array<ScoreRecord> = PassSurveyModel.ScoresExtractor.extract(
      items,
      reportSettings.reports,
    );

    return { alerts: extractedAlerts, scores: scoreRecords };
  }, [activityProgress, props.scoresAndReports]);

  const summaryData = useMemo<UISummaryData | null>(() => {
    const flowProgress: ActivityOrFlowProgress | null = getGroupProgress({
      entityId: props.flowId ? props.flowId : props.activityId,
      eventId: props.eventId,
    });

    if (!flowProgress) {
      return null;
    }

    const flowSummaryData = flowProgress.context.summaryData;

    let activityIds = Object.keys(flowSummaryData);

    activityIds = activityIds.sort((a1Id, a2Id) => {
      return flowSummaryData[a1Id].order - flowSummaryData[a2Id].order;
    });

    const fullAlertsList: AnswerAlerts = [];
    const fullScoresList: ActivityScore[] = [];

    for (const aid of activityIds) {
      const { alerts, scores } = flowSummaryData[aid];
      fullAlertsList.push(...alerts);
      fullScoresList.push(scores);
    }

    const result: UISummaryData = {
      alerts: fullAlertsList.map((x) => x.message),
      scores: fullScoresList
        .filter((x) => x.scores.length)
        .map((x) => ({
          activityName: x.activityName,
          scores: x.scores.map((s) => ({
            label: s.name,
            value: s.value,
            highlighted: s.flagged,
          })),
        })),
    };

    return result;
  }, [getGroupProgress, props]);

  return {
    getSummaryForCurrentActivity,
    summaryData,
  };
};
