import { useContext } from 'react';

import { ActivityMetaData } from './ActivityMetaData';
import SurveyLayout from './SurveyLayout';
import { SurveyBasicContext } from '../lib';

import { appletModel } from '~/entities/applet';
import { StartAssessmentButton, useFlowType } from '~/features/PassSurvey';
import { ActivityDTO } from '~/shared/api';
import { Theme } from '~/shared/constants';
import { AvatarBase } from '~/shared/ui/Avatar';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { useCustomMediaQuery } from '~/shared/utils';

type Props = {
  activityDetails: ActivityDTO;
};

export const AssessmentWelcomeScreen = (props: Props) => {
  const { greaterThanSM } = useCustomMediaQuery();

  const basicContext = useContext(SurveyBasicContext);

  const flowParams = useFlowType();

  const { setInitialProgress } = appletModel.hooks.useActivityProgress();

  const entityId = flowParams.isFlow ? flowParams.flowId : props.activityDetails.id;

  const { getGroupProgress } = appletModel.hooks.useGroupProgressState();

  const startAssessment = () => {
    return setInitialProgress({ activity: props.activityDetails, eventId: basicContext.eventId });
  };

  return (
    <SurveyLayout
      activityName={props.activityDetails.name}
      progress={0}
      isSaveAndExitButtonShown={true}
      footerActions={
        <StartAssessmentButton
          width={greaterThanSM ? '375px' : '335px'}
          onClick={startAssessment}
        />
      }
    >
      <Box
        id="welcome-screen-activity-details"
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop="80px"
        maxWidth="570px"
      >
        <AvatarBase
          src={props.activityDetails.image}
          name={props.activityDetails?.name}
          width="124px"
          height="124px"
          testid="flow-welcome-screen-avatar"
        />

        <Text
          variant="body1"
          fontSize="18px"
          fontWeight="400"
          color={Theme.colors.light.secondary}
          sx={{ marginTop: '24px' }}
        >
          <ActivityMetaData
            activityLength={props.activityDetails.items.length}
            groupInProgress={getGroupProgress({ entityId, eventId: basicContext.eventId })}
          />
        </Text>
        <Text
          variant="body1"
          fontSize="18px"
          fontWeight="700"
          color={Theme.colors.light.onSurface}
          margin="16px 0px"
          testid="flow-welcome-screen-title"
        >
          {props.activityDetails.name}
        </Text>

        <Text
          variant="body1"
          fontSize="18px"
          fontWeight="400"
          color={Theme.colors.light.onSurface}
          testid="flow-welcome-screen-decription"
          sx={{ textAlign: 'center' }}
        >
          {props.activityDetails.description}
        </Text>
      </Box>
    </SurveyLayout>
  );
};
