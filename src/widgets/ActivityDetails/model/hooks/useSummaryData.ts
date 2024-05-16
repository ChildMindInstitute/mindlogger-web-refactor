import { useCallback } from 'react';

import { getProgressId } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { PassSurveyModel } from '~/features/PassSurvey';
import { AnswerAlerts, ScoreRecord } from '~/features/PassSurvey/lib';
import { ActivityDTO } from '~/shared/api';
import { useAppSelector } from '~/shared/utils';

type Props = {
  activity: ActivityDTO;
  eventId: string;
};

export const useSummaryData = (props: Props) => {
  const activityRecord = props.activity;

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
};
