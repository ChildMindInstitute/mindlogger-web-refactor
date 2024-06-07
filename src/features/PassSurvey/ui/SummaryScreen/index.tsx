import { Divider } from '@mui/material';

import { Alerts } from './Alerts';
import { ScoreSection } from './ScoreSection';
import { useFlowType, useSummaryData } from '../../hooks';

import { getProgressId } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { useAppSelector, useCustomTranslation } from '~/shared/utils';

type Props = {
  activityId: string;
  activityName: string;
  eventId: string;
};

export const SummaryScreen = (props: Props) => {
  const { isFlow, flowId } = useFlowType();
  const { t } = useCustomTranslation();

  const activityEventId = getProgressId(props.activityId, props.eventId);

  const activityProgress = useAppSelector((state) =>
    appletModel.selectors.selectActivityProgress(state, activityEventId),
  );

  const { summaryData } = useSummaryData({
    activityId: props.activityId,
    activityName: props.activityName,
    eventId: props.eventId,
    scoresAndReports: activityProgress.scoreSettings,
    flowId: isFlow ? flowId : undefined,
  });

  return (
    <Box flex={1}>
      <Text fontWeight="400" fontSize="40px" lineHeight="54px" testid="report-summary-screen">
        {t('reportSummary')}
      </Text>
      {summaryData && summaryData.alerts.length > 0 && (
        <Box margin="16px 0px">
          <Alerts alerts={summaryData.alerts} />
        </Box>
      )}
      <Box>
        {summaryData &&
          summaryData.scores.length > 0 &&
          summaryData.scores.map((score, index) => (
            <Box key={index}>
              <Divider sx={{ margin: '16px 0px' }} />
              <ScoreSection score={score} />
            </Box>
          ))}
      </Box>
    </Box>
  );
};
