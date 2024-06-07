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

  activityId: string;
  activityName: string;
};

export const AssessmentSummaryScreen = (props: Props) => {
  const context = useContext(SurveyBasicContext);

  const { t } = useCustomTranslation();
  const { greaterThanSM } = useCustomMediaQuery();

  const flowParams = useFlowType();

  const applet = props.appletDetails;

  const eventId = context.eventId;

  const { completeActivity, completeFlow } = appletModel.hooks.useEntityComplete({
    applet,
    activityId: props.activityId,
    eventId,
    publicAppletKey: context.isPublic ? context.publicAppletKey : null,
    flowId: flowParams.isFlow ? flowParams.flowId : null,
  });

  const onFinish = () => {
    return flowParams.isFlow ? completeFlow(flowParams.flowId) : completeActivity();
  };

  return (
    <SurveyLayout
      activityName={props.activityName}
      appletId={applet.id}
      activityId={props.activityId}
      eventId={eventId}
      progress={100}
      isPublic={context.isPublic}
      publicAppletKey={context.isPublic ? context.publicAppletKey : null}
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
          activityId={props.activityId}
          activityName={props.activityName}
          eventId={eventId}
        />
      </Box>
    </SurveyLayout>
  );
};
