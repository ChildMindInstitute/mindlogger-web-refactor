import { useCallback, useMemo } from 'react';

import { ActivityScore, FlowProgress, getProgressId } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { PassSurveyModel } from '~/features/PassSurvey';
import { AnswerAlerts, ScoreRecord } from '~/features/PassSurvey/lib';
import { ActivityDTO } from '~/shared/api';
import { useAppSelector } from '~/shared/utils';

type Props = {
  activity: ActivityDTO;
  eventId: string;
  flowId?: string;
};

type UIScore = {
  label: string;
  value: number;
  highlighted: boolean;
};

type UIActivityScores = {
  activityName: string;
  scores: Array<UIScore>;
};

type UISummaryData = {
  alerts: string[];
  scores: UIActivityScores[];
};

export const useSummaryData = (props: Props): UISummaryData | null => {
  const activityRecord = props.activity;

  const { getGroupProgress } = appletModel.hooks.useGroupProgressState();

  const progressId = getProgressId(activityRecord.id, props.eventId);

  const activityProgress = useAppSelector((state) =>
    appletModel.selectors.selectActivityProgress(state, progressId),
  );

  const getSummaryForCurrentActivity = useCallback(() => {
    if (!activityRecord.scoresAndReports.showScoreSummary) {
      return { alerts: [], scores: [] };
    }

    const items = activityProgress.items;
    const reportSettings = activityRecord.scoresAndReports;

    const extractedAlerts: AnswerAlerts = PassSurveyModel.AlertsExtractor.extractForSummary(items);

    const scoreRecords: Array<ScoreRecord> = PassSurveyModel.ScoresExtractor.extract(
      items,
      reportSettings.reports,
    );

    return { alerts: extractedAlerts, scores: scoreRecords };
  }, [activityProgress, activityRecord]);

  const summaryData = useMemo<UISummaryData | null>(() => {
    if (!props.activity) {
      return null;
    }

    const currentActivityName = props.activity.name;

    const { alerts: currentAlerts, scores: currentScores } = getSummaryForCurrentActivity();

    let flowProgress: FlowProgress | null = null;

    if (props.flowId) {
      flowProgress = getGroupProgress({
        entityId: props.flowId,
        eventId: props.eventId,
      }) as FlowProgress;
    }

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

    fullAlertsList.push(...currentAlerts);

    fullScoresList.push({
      activityName: currentActivityName,
      scores: currentScores,
    });

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
  }, [getGroupProgress, getSummaryForCurrentActivity, props]);

  return summaryData;
};
