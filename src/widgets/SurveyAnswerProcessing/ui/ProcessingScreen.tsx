import { useCallback, useContext, useMemo } from 'react';

import { ProgressBar } from './ProgressBar';
import { useAutoCompletion } from '../model/useAutoCompletion';

import { appletModel } from '~/entities/applet';
import { useBanners } from '~/entities/banner/model';
import { SurveyContext, SurveyLayout, SurveyManageButtons } from '~/features/PassSurvey';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { useCustomTranslation } from '~/shared/utils';

export const ProcessingScreen = () => {
  const { t } = useCustomTranslation();

  const context = useContext(SurveyContext);

  const { addWarningBanner } = useBanners();

  const headerTitle = useMemo(() => {
    if (context.flow) {
      return context.flow.name;
    }

    return context.activity.name;
  }, [context.activity.name, context.flow]);

  const { completeActivity, completeFlow } = appletModel.hooks.useEntityComplete({
    eventId: context.eventId,
    activityId: context.activityId,
    publicAppletKey: context.publicAppletKey,
    flowId: context.flow?.id ?? null,
    appletId: context.appletId,
    flow: context.flow,
  });

  const { state, autoSubmitAnswers } = useAutoCompletion();

  const isNotStarted = state.status === 'not_started';

  const isCompleted = state.status === 'completed';

  const onFinish = useCallback(() => {
    const canBeClosed = isCompleted;

    if (!canBeClosed) {
      return addWarningBanner(t('answerProcessingScreen.processInProgress'));
    }

    return context.flow ? completeFlow(true) : completeActivity();
  }, [addWarningBanner, completeActivity, completeFlow, context.flow, isCompleted, t]);

  return (
    <SurveyLayout
      isSaveAndExitButtonShown={false}
      headerTitle={headerTitle}
      footerActions={
        <SurveyManageButtons
          isLoading={false}
          isBackShown={false}
          onNextButtonClick={isNotStarted ? autoSubmitAnswers : onFinish}
          nextButtonText={
            isNotStarted ? t('answerProcessingScreen.processMyAnswers') : t('Consent.close')
          }
        />
      }
    >
      <Box display="flex" flex={1} justifyContent="center" alignItems="center">
        <Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            gap="12px"
          >
            <Text variant="h4">{t('answerProcessingScreen.title')}</Text>
            <Text variant="body1">
              {isCompleted
                ? t('answerProcessingScreen.processCompleted')
                : t('answerProcessingScreen.description')}
            </Text>
          </Box>

          <ProgressBar
            activityName={context.activity.name}
            currentActivityIndex={state.currentActivityIndex}
            activitiesCount={state.activitiesCount}
            isCompleted={isCompleted}
            isNotStarted={isNotStarted}
            isInProgress={!isCompleted && !isNotStarted}
          />
        </Box>
      </Box>
    </SurveyLayout>
  );
};
