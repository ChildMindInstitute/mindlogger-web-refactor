import { useContext } from 'react';

import { TakeNowSuccessModalProps } from '../lib/types';

import { MuiModal } from '~/shared/ui';
import {
  addFeatureToEvent,
  Mixpanel,
  MixpanelEventType,
  MixpanelFeature,
  MixpanelProps,
  ReturnToAdminAppEvent,
  useCustomTranslation,
} from '~/shared/utils';
import { AppletDetailsContext } from '~/widgets/ActivityGroups/lib';

export const TakeNowSuccessModal = ({
  isOpen,
  onClose,
  multiInformantAssessmentId,
  activityId,
  activityFlowId,
  submitId,
}: TakeNowSuccessModalProps) => {
  const { t } = useCustomTranslation();
  const { applet } = useContext(AppletDetailsContext);

  const handleReturnToAdminAppClick = () => {
    const event: ReturnToAdminAppEvent = {
      action: MixpanelEventType.ReturnToAdminApp,
      [MixpanelProps.SubmitId]: submitId,
      [MixpanelProps.AppletId]: applet.id,
    };

    if (activityId) {
      event[MixpanelProps.ActivityId] = activityId;
    }
    if (activityFlowId) {
      event[MixpanelProps.ActivityFlowId] = activityFlowId;
    }

    addFeatureToEvent(event, MixpanelFeature.MultiInformant);

    if (multiInformantAssessmentId) {
      event[MixpanelProps.MultiInformantAssessmentId] = multiInformantAssessmentId;
    }

    Mixpanel.track(event, { send_immediately: true }, () => {
      onClose?.();
      const targetWindow = window.opener as Window;

      if (targetWindow) {
        // Send message to the opening tab in the Admin App to close this tab (see its TakeNowModal component).
        targetWindow.postMessage('close-me', import.meta.env.VITE_ADMIN_PANEL_HOST);
      }
    });
  };

  return (
    <MuiModal
      isOpen={isOpen}
      title={t('takeNow.successModalTitle')}
      label={t('takeNow.successModalLabel')}
      footerPrimaryButton={t('takeNow.successModalPrimaryAction')}
      onPrimaryButtonClick={handleReturnToAdminAppClick}
      footerSecondaryButton={t('takeNow.successModalSecondaryAction')}
      onSecondaryButtonClick={onClose}
      DialogProps={{
        disableEscapeKeyDown: true,
      }}
    />
  );
};
