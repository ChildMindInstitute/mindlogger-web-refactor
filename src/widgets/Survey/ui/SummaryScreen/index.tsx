import { useContext } from 'react';

import Divider from '@mui/material/Divider';

import { Alerts } from './Alerts';
import { ScoreSection } from './ScoreSection';

import { getProgressId } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import {
  SurveyContext,
  SurveyManageButtons,
  useSummaryData,
  SurveyLayout,
} from '~/features/PassSurvey';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { useAppSelector, useCustomMediaQuery, useCustomTranslation } from '~/shared/utils';

const SummaryScreen = () => {
  const { t } = useCustomTranslation();

  const { greaterThanSM } = useCustomMediaQuery();

  const context = useContext(SurveyContext);

  const activityProgress = useAppSelector((state) =>
    appletModel.selectors.selectActivityProgress(
      state,
      getProgressId(context.activityId, context.eventId),
    ),
  );

  const { completeActivity, completeFlow } = appletModel.hooks.useEntityComplete({
    eventId: context.eventId,
    activityId: context.activityId,
    publicAppletKey: context.publicAppletKey,
    flowId: context.flow?.id ?? null,
    appletId: context.appletId,
    flow: context.flow,
  });

  const onFinish = () => {
    return context.flow ? completeFlow() : completeActivity();
  };

  const { summaryData } = useSummaryData({
    activityId: context.activityId,
    eventId: context.eventId,
    activityName: context.activity.name,
    scoresAndReports: activityProgress.scoreSettings,
    flowId: context.flow?.id ?? null,
  });

  return (
    <SurveyLayout
      isSaveAndExitButtonShown={false}
      progress={100}
      footerActions={
        <SurveyManageButtons
          isLoading={false}
          isBackShown={false}
          onNextButtonClick={onFinish}
          nextButtonText={t('Consent.close')}
        />
      }
    >
      <Box
        maxWidth="900px"
        display="flex"
        alignItems="flex-start"
        flex={1}
        padding={greaterThanSM ? '72px 48px' : '36px 16px'}
        data-testid="assessment-summary-screen-container"
      >
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
      </Box>
    </SurveyLayout>
  );
};

export default SummaryScreen;