import { useCallback, useContext } from 'react';

import { ProgressBar } from './ProgressBar';

import { useBanners } from '~/entities/banner/model';
import { SurveyContext, SurveyLayout, SurveyManageButtons } from '~/features/PassSurvey';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { useCustomTranslation } from '~/shared/utils';

export const ProcessingScreen = () => {
  const { t } = useCustomTranslation();

  const context = useContext(SurveyContext);

  const { addWarningBanner } = useBanners();

  const onFinish = useCallback(() => {
    const canBeClosed = true;

    if (!canBeClosed) {
      return addWarningBanner(t('answerProcessingScreen.processInProgress'));
    }

    return console.log('Entity closed'); // context.flow ? completeFlow(true) : completeActivity();
  }, [addWarningBanner, t]);

  return (
    <SurveyLayout
      isSaveAndExitButtonShown={false}
      title="Test Activity Or Flow Title" // TODO: Change on real one
      footerActions={
        <SurveyManageButtons
          isLoading={false}
          isBackShown={false}
          onNextButtonClick={onFinish}
          nextButtonText={t('Consent.close')}
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
            <Text variant="body1">{t('answerProcessingScreen.description')}</Text>
          </Box>

          <ProgressBar
            activityName={context.activity.name}
            currentActivityIndex={0}
            activitiesCount={10}
            isCompleted={false}
            isNotStarted={true}
            isInProgress={false}
          />
        </Box>
      </Box>
    </SurveyLayout>
  );
};
