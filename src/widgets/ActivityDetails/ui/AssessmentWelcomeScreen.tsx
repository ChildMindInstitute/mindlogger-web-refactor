import { useContext } from 'react';

import Box from '@mui/material/Box';

import { ActivityMetaData } from './ActivityMetaData';
import { AssessmentLayoutFooter } from './AssessmentLayoutFooter';
import { AssessmentLayoutHeader } from './AssessmentLayoutHeader';
import Layout from '../../AppLayout';
import { ActivityDetailsContext } from '../lib';

import { appletModel } from '~/entities/applet';
import { StartAssessmentButton } from '~/features/StartAssessment';
import { ActivityDTO } from '~/shared/api';
import { Theme } from '~/shared/constants';
import { AvatarBase, Text } from '~/shared/ui';
import { useCustomMediaQuery, useFlowType } from '~/shared/utils';

type Props = {
  activityDetails: ActivityDTO;
};

export const AssessmentWelcomeScreen = (props: Props) => {
  const { greaterThanSM } = useCustomMediaQuery();

  const context = useContext(ActivityDetailsContext);

  const flowParams = useFlowType();

  const { setInitialProgress } = appletModel.hooks.useActivityProgress();

  const entityId = flowParams.isFlow ? flowParams.flowId : props.activityDetails.id;

  const { getGroupProgress } = appletModel.hooks.useGroupProgressState();

  const startAssessment = () => {
    return setInitialProgress({ activity: props.activityDetails, eventId: context.eventId });
  };

  return (
    <Layout
      bgColor={Theme.colors.light.surface}
      header={
        <AssessmentLayoutHeader
          title={props.activityDetails.name}
          progress={0}
          appletId={context.appletId}
          activityId={props.activityDetails.id}
          eventId={context.eventId}
          isPublic={context.isPublic}
          publicKey={context.isPublic ? context.publicAppletKey : null}
        />
      }
      footer={
        <AssessmentLayoutFooter>
          <StartAssessmentButton
            width={greaterThanSM ? '375px' : '335px'}
            onClick={startAssessment}
          />
        </AssessmentLayoutFooter>
      }
    >
      <Box height="100%" width="100%" display="flex" justifyContent="center" paddingTop="80px">
        <Box
          id="welcome-screen-activity-details"
          display="flex"
          flexDirection="column"
          alignItems="center"
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
              groupInProgress={getGroupProgress({ entityId, eventId: context.eventId })}
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
      </Box>
    </Layout>
  );
};
