import { useContext } from 'react';

import Divider from '@mui/material/Divider';

import { Alerts } from './Alerts';
import { ScoreSection } from './ScoreSection';
import { SurveyBasicContext } from '../../lib';
import SurveyLayout from '../SurveyLayout';

import { getProgressId } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { SurveyManageButtons, useFlowType, useSummaryData } from '~/features/PassSurvey';
import { AppletDTO } from '~/shared/api';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { useAppSelector, useCustomMediaQuery, useCustomTranslation } from '~/shared/utils';

type Props = {
  appletDetails: AppletDTO;

  activityName: string;
};

const SummaryScreen = (props: Props) => {
  const basicContext = useContext(SurveyBasicContext);

  const { t } = useCustomTranslation();
  const { greaterThanSM } = useCustomMediaQuery();

  const { isFlow, flowId } = useFlowType();

  const applet = props.appletDetails;

  const eventId = basicContext.eventId;
  const activityId = basicContext.activityId;

  const activityEventId = getProgressId(activityId, eventId);

  const activityProgress = useAppSelector((state) =>
    appletModel.selectors.selectActivityProgress(state, activityEventId),
  );

  const { completeActivity, completeFlow } = appletModel.hooks.useEntityComplete({
    applet,
    activityId: basicContext.activityId,
    eventId,
    publicAppletKey: basicContext.isPublic ? basicContext.publicAppletKey : null,
    flowId: isFlow ? flowId : null,
  });

  const onFinish = () => {
    return isFlow ? completeFlow(flowId) : completeActivity();
  };

  const { summaryData } = useSummaryData({
    activityId: basicContext.activityId,
    activityName: props.activityName,
    eventId: basicContext.eventId,
    scoresAndReports: activityProgress.scoreSettings,
    flowId: isFlow ? flowId : undefined,
  });

  return (
    <SurveyLayout
      activityName={props.activityName}
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
