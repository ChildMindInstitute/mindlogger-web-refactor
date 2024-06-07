import { useContext } from 'react';

import SurveyLayout from './SurveyLayout';
import { SurveyBasicContext } from '../lib';

import { appletModel } from '~/entities/applet';
import { SummaryScreen, SurveyManageButtons, useFlowType } from '~/features/PassSurvey';
import { AppletDetailsDTO } from '~/shared/api';
import Box from '~/shared/ui/Box';
import { useCustomMediaQuery, useCustomTranslation } from '~/shared/utils';

type Props = {
  appletDetails: AppletDetailsDTO;

  activityName: string;
};

export const AssessmentSummaryScreen = (props: Props) => {
  const basicContext = useContext(SurveyBasicContext);

  const { t } = useCustomTranslation();
  const { greaterThanSM } = useCustomMediaQuery();

  const flowParams = useFlowType();

  const applet = props.appletDetails;

  const eventId = basicContext.eventId;

  const { completeActivity, completeFlow } = appletModel.hooks.useEntityComplete({
    applet,
    activityId: basicContext.activityId,
    eventId,
    publicAppletKey: basicContext.isPublic ? basicContext.publicAppletKey : null,
    flowId: flowParams.isFlow ? flowParams.flowId : null,
  });

  const onFinish = () => {
    return flowParams.isFlow ? completeFlow(flowParams.flowId) : completeActivity();
  };

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
        <SummaryScreen
          activityId={basicContext.activityId}
          activityName={props.activityName}
          eventId={eventId}
        />
      </Box>
    </SurveyLayout>
  );
};
