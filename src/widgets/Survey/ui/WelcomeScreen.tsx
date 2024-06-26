import { useContext } from 'react';

import { ActivityMetaData } from './ActivityMetaData';
import SurveyLayout from './SurveyLayout';

import { appletModel } from '~/entities/applet';
import { StartSurveyButton, SurveyContext } from '~/features/PassSurvey';
import { Theme } from '~/shared/constants';
import { AvatarBase } from '~/shared/ui/Avatar';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { useCustomMediaQuery, useCustomTranslation } from '~/shared/utils';

const WelcomeScreen = () => {
  const { greaterThanSM } = useCustomMediaQuery();

  const { t } = useCustomTranslation();

  const context = useContext(SurveyContext);

  const entityTimer = context.event.timers.timer ?? null;

  const { startActivity, startFlow } = appletModel.hooks.useEntityStart();

  const { setInitialProgress } = appletModel.hooks.useActivityProgress();

  const { getGroupProgress } = appletModel.hooks.useGroupProgressState();

  const startAssessment = () => {
    const groupProgress = getGroupProgress({
      entityId: context.entityId,
      eventId: context.eventId,
    });

    if (context.flow && !groupProgress) {
      startFlow(context.eventId, context.flow);
    }

    if (!context.flow) {
      startActivity(context.activityId, context.eventId);
    }

    return setInitialProgress({ activity: context.activity, eventId: context.eventId });
  };

  return (
    <SurveyLayout
      progress={0}
      isSaveAndExitButtonShown={true}
      entityTimer={entityTimer ?? undefined}
      footerActions={
        <StartSurveyButton
          width={greaterThanSM ? '375px' : '335px'}
          onClick={startAssessment}
          text={t('start')}
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
          src={context.activity.image}
          name={context.activity.name}
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
            activityLength={context.activity.items.length}
            groupInProgress={getGroupProgress({
              entityId: context.entityId,
              eventId: context.eventId,
            })}
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
          {context.activity.name}
        </Text>

        <Text
          variant="body1"
          fontSize="18px"
          fontWeight="400"
          color={Theme.colors.light.onSurface}
          testid="flow-welcome-screen-decription"
          sx={{ textAlign: 'center' }}
        >
          {context.activity.description}
        </Text>
      </Box>
    </SurveyLayout>
  );
};

export default WelcomeScreen;
