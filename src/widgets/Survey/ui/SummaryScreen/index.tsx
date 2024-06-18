import { useContext } from 'react';

import Divider from '@mui/material/Divider';

import { Alerts } from './Alerts';
import { ScoreSection } from './ScoreSection';
import { SurveyBasicContext, SurveyContext } from '../../lib';
import SurveyLayout from '../SurveyLayout';

import { getProgressId } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { SurveyManageButtons, useSummaryData } from '~/features/PassSurvey';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { useAppSelector, useCustomMediaQuery, useCustomTranslation } from '~/shared/utils';

const SummaryScreen = () => {
  const { t } = useCustomTranslation();

  const { greaterThanSM } = useCustomMediaQuery();

  const basicContext = useContext(SurveyBasicContext);

  const surveyContext = useContext(SurveyContext);

  const applet = surveyContext.applet;

  const eventId = basicContext.eventId;
  const activityId = basicContext.activityId;

  const activityProgress = useAppSelector((state) =>
    appletModel.selectors.selectActivityProgress(state, getProgressId(activityId, eventId)),
  );

  const { completeActivity, completeFlow } = appletModel.hooks.useEntityComplete({
    applet,
    eventId,
    activityId: basicContext.activityId,
    publicAppletKey: basicContext.isPublic ? basicContext.publicAppletKey : null,
    flowId: basicContext.flowId,
  });

  const onFinish = () => {
    return basicContext.flowId ? completeFlow(basicContext.flowId) : completeActivity();
  };

  const { summaryData } = useSummaryData({
    activityId: basicContext.activityId,
    eventId: basicContext.eventId,
    activityName: surveyContext.activity.name,
    scoresAndReports: activityProgress.scoreSettings,
    flowId: basicContext.flowId,
  });

  return (
    <SurveyLayout
      progress={100}
      isSaveAndExitButtonShown={false}
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
