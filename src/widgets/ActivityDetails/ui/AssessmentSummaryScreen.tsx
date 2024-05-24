import { useContext } from 'react';

import { AssessmentLayout } from './AssessmentLayout';
import { ActivityDetailsContext } from '../lib';
import { useEntityComplete } from '../model/hooks';

import { SummaryScreen, SurveyManageButtons } from '~/features/PassSurvey';
import {
  ActivityDTO,
  AppletDetailsDTO,
  AppletEventsResponse,
  RespondentMetaDTO,
} from '~/shared/api';
import Box from '~/shared/ui/Box';
import { useCustomMediaQuery, useCustomTranslation, useFlowType } from '~/shared/utils';

type Props = {
  activityDetails: ActivityDTO;
  eventsRawData: AppletEventsResponse;
  appletDetails: AppletDetailsDTO;
  respondentMeta?: RespondentMetaDTO;
};

export const AssessmentSummaryScreen = (props: Props) => {
  const context = useContext(ActivityDetailsContext);

  const { t } = useCustomTranslation();
  const { greaterThanSM } = useCustomMediaQuery();

  const flowParams = useFlowType();

  const applet = props.appletDetails;

  const activityId = props.activityDetails.id;

  const eventId = context.eventId;

  const { completeActivity, completeFlow } = useEntityComplete({
    applet,
    activityId,
    eventId,
    publicAppletKey: context.isPublic ? context.publicAppletKey : null,
    flowId: flowParams.isFlow ? flowParams.flowId : null,
  });

  const onFinish = () => {
    return flowParams.isFlow ? completeFlow(flowParams.flowId) : completeActivity();
  };

  return (
    <AssessmentLayout
      activityName={props.activityDetails.name}
      appletId={applet.id}
      activityId={activityId}
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
      >
        <SummaryScreen
          activityId={activityId}
          activityName={props.activityDetails.name}
          eventId={eventId}
        />
      </Box>
    </AssessmentLayout>
  );
};
