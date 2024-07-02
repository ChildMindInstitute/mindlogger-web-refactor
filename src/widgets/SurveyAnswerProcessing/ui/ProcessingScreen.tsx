import { useCallback, useContext } from 'react';

import { ProgressBar } from './ProgressBar';

import { appletModel } from '~/entities/applet';
import { useBanners } from '~/entities/banner/model';
import { SurveyContext, SurveyLayout, SurveyManageButtons } from '~/features/PassSurvey';
import { Theme } from '~/shared/constants';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { useCustomTranslation } from '~/shared/utils';

export const ProcessingScreen = () => {
  const { t } = useCustomTranslation();

  const context = useContext(SurveyContext);

  const { addWarningBanner } = useBanners();

  const { completeActivity, completeFlow } = appletModel.hooks.useEntityComplete({
    activityId: context.activityId,
    eventId: context.eventId,
    appletId: context.appletId,
    flow: context.flow,
    flowId: context.flow?.id ?? null,
    publicAppletKey: context.publicAppletKey,
  });

  const onFinish = useCallback(() => {
    const canBeClosed = true; // TODO: Change on real one when the store will be ready

    if (!canBeClosed) {
      return addWarningBanner(t('answerProcessingScreen.processInProgress'));
    }

    return context.flow ? completeFlow({ forceComplete: true }) : completeActivity();
  }, [addWarningBanner, completeActivity, completeFlow, context.flow, t]);

  return (
    <SurveyLayout
      isSaveAndExitButtonShown={false}
      title="Test Activity Or Flow Title" // TODO: Change on real one when the store will be ready
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
            <Text variant="h4">{t('answerProcessingScreen.title')}</Text>
            <Text variant="body1">{t('answerProcessingScreen.description')}</Text>
          </Box>

          <Box
            padding="16px 8px"
            marginTop="16px"
            bgcolor={Theme.colors.light.primary012}
            borderRadius="12px"
          >
            <ProgressBar
              activityName={context.activity.name}
              currentActivityIndex={0}
              activitiesCount={10}
              isCompleted={false} // TODO: Change on real one when the store will be ready
              isNotStarted={true} // TODO: Change on real one when the store will be ready
              isInProgress={false} // TODO: Change on real one when the store will be ready
            />
          </Box>
        </Box>
      </Box>
    </SurveyLayout>
  );
};
