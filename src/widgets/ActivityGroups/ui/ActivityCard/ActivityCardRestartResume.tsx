import { useState } from 'react';

import ButtonBase from '@mui/material/ButtonBase';

import { ActivityStatus } from '~/abstract/lib/GroupBuilder';
import ActivityRestartIcon from '~/assets/activity-restart-icon.svg';
import { useBanners } from '~/entities/banner/model';
import { Theme } from '~/shared/constants';
import { BaseButton, MuiModal } from '~/shared/ui';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { useCustomMediaQuery, useCustomTranslation } from '~/shared/utils';

type Props = {
  activityStatus: ActivityStatus;
  activityName: string;
  onRestartClick: () => void;
  onResumeClick: () => void;
  onStartClick: () => void;
  isDisabled: boolean;
  isAutoCompletionRecordDefined: boolean;
};

export const ActivityCardRestartResume = ({
  activityStatus,
  onRestartClick,
  onResumeClick,
  onStartClick,
  activityName,
  isDisabled,
  isAutoCompletionRecordDefined,
}: Props) => {
  const [isRestartConfirmationModalOpen, setIsRestartConfirmationModalOpen] = useState(false);

  const { lessThanSM } = useCustomMediaQuery();

  const { t } = useCustomTranslation();

  const { addWarningBanner } = useBanners();

  const closeModal = () => setIsRestartConfirmationModalOpen(false);

  const openModal = () => {
    if (isAutoCompletionRecordDefined) {
      return addWarningBanner(t('autoCompletion.restartActivityWarning'));
    }

    setIsRestartConfirmationModalOpen(true);
  };

  return (
    <>
      {activityStatus === ActivityStatus.InProgress ? (
        <Box
          marginTop={lessThanSM ? 3 : 0}
          alignSelf="center"
          data-testid="assessment-buttons"
          flexDirection={lessThanSM ? 'row' : 'column'}
          flexWrap="nowrap"
          display="flex"
          flex={1}
          justifyContent="center"
          alignItems="flex-end"
          gap="8px"
        >
          <BaseButton
            data-testid="assessment-resume-button"
            disabled={isDisabled}
            sx={{
              width: '120px',
            }}
            type="button"
            variant="contained"
            onClick={onResumeClick}
            text={t('additional.resume')}
          />
          <ButtonBase
            disabled={isDisabled}
            onClick={openModal}
            data-testid="assessment-restart-button"
            sx={{
              borderRadius: '100px',
              padding: '10px 10px',
              transition: 'all 0.2s',
              minWidth: '120px',
              mt: '20px',
            }}
          >
            <img src={ActivityRestartIcon} alt={String(t('additional.restart'))} />

            <Text sx={{ marginLeft: 1 }} variant="body1" fontSize="16px">
              {t('additional.restart')}
            </Text>
          </ButtonBase>
        </Box>
      ) : (
        <Box data-testid="assessment-buttons" alignSelf="center" width="120px">
          <BaseButton
            disabled={isDisabled}
            type="button"
            variant="contained"
            onClick={onStartClick}
            text={t('start')}
            data-testid="assessment-start-button"
          />
        </Box>
      )}

      <MuiModal
        testId="assessment-restart-modal"
        isOpen={isRestartConfirmationModalOpen}
        onHide={closeModal}
        title={t('additional.restart_activity')}
        footerPrimaryButton={t('additional.restart')}
        onPrimaryButtonClick={onRestartClick}
        footerSecondaryButton={t('additional.cancel')}
        onSecondaryButtonClick={closeModal}
        showCloseIcon
        titleProps={{
          fontWeight: '400',
          marginY: 2,
        }}
        labelComponent={
          <Text
            fontSize="16px"
            fontWeight="400"
            lineHeight="24px"
            letterSpacing="0.15px"
            color={Theme.colors.light.onSurface}
            sx={{ textTransform: 'none' }}
          >
            {t('additional.activity_resume_restart')} <b>{activityName}</b>?
          </Text>
        }
        footerWrapperSXProps={{
          marginLeft: 'auto',
          marginTop: 2,
        }}
        maxWidth="sm"
      />
    </>
  );
};
