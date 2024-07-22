import { useCallback, useContext } from 'react';

import { ProgressBar } from './ProgressBar';
import { useAutoCompletion } from '../lib';

import { appletModel } from '~/entities/applet';
import { useBanners } from '~/entities/banner/model';
import { AutoCompletionModel } from '~/features/AutoCompletion';
import { SurveyContext, SurveyLayout, SurveyManageButtons } from '~/features/PassSurvey';
import { ROUTES, Theme } from '~/shared/constants';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { useCustomNavigation, useCustomTranslation } from '~/shared/utils';

export const AutoCompletionScreen = () => {
  const { t } = useCustomTranslation();

  const navigator = useCustomNavigation();

  const context = useContext(SurveyContext);

  const { addWarningBanner } = useBanners();

  const { entityCompleted } = appletModel.hooks.useGroupProgressStateManager();

  const { removeAutoCompletion } = AutoCompletionModel.useAutoCompletionStateManager();

  const { completionState, activityName } = useAutoCompletion();

  const onFinish = useCallback(() => {
    if (!completionState) {
      throw new Error('[AutoCompletionScreen:onFinish] State is not defined');
    }

    const canBeClosed =
      completionState.activityIdsToSubmit.length ===
      completionState.successfullySubmittedActivityIds.length;

    if (!canBeClosed) {
      return addWarningBanner(t('answerProcessingScreen.processInProgress'));
    }

    removeAutoCompletion({
      entityId: context.entityId,
      eventId: context.eventId,
    });

    entityCompleted({
      entityId: context.entityId,
      eventId: context.eventId,
    });

    if (context.publicAppletKey) {
      return navigator.navigate(ROUTES.publicJoin.navigateTo(context.publicAppletKey), {
        replace: true,
      });
    }

    return navigator.navigate(ROUTES.appletDetails.navigateTo(context.appletId), {
      replace: true,
    });
  }, [
    addWarningBanner,
    completionState,
    context.appletId,
    context.entityId,
    context.eventId,
    context.publicAppletKey,
    entityCompleted,
    navigator,
    removeAutoCompletion,
    t,
  ]);

  return (
    <SurveyLayout
      isSaveAndExitButtonShown={false}
      title={context.flow ? context.flow.name : context.activity.name}
      footerActions={
        <SurveyManageButtons
          isLoading={false}
          isBackShown={false}
          onNextButtonClick={onFinish}
          nextButtonText={t('Consent.close')}
        />
      }
    >
      <Box display="flex" flex={1} justifyContent="center" alignItems="center" paddingX="24px">
        <Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            gap="12px"
          >
            <Text variant="h4">{t('autoCompletion.title')}</Text>
            <Text variant="body1">{t('autoCompletion.description')}</Text>
          </Box>

          <Box
            padding="16px 8px"
            marginTop="16px"
            bgcolor={Theme.colors.light.primary012}
            borderRadius="12px"
          >
            {completionState && (
              <ProgressBar
                activityName={activityName}
                currentActivityIndex={completionState.successfullySubmittedActivityIds.length}
                activitiesCount={completionState.activityIdsToSubmit.length}
                isCompleted={
                  completionState.activityIdsToSubmit.length ===
                  completionState.successfullySubmittedActivityIds.length
                }
              />
            )}
          </Box>
        </Box>
      </Box>
    </SurveyLayout>
  );
};