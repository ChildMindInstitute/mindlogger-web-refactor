import { useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { ActivityGroupList } from './ActivityGroupList';
import { AppletDetailsContext } from '../lib';

import { appletModel, useAppletBaseInfoByIdQuery } from '~/entities/applet';
import { useEventsbyAppletIdQuery } from '~/entities/event';
import { TakeNowSuccessModalProps } from '~/features/TakeNow/lib/types';
import { TakeNowSuccessModal } from '~/features/TakeNow/ui/TakeNowSuccessModal';
import Box from '~/shared/ui/Box';
import Loader from '~/shared/ui/Loader';
import { useCustomTranslation, useOnceEffect } from '~/shared/utils';
import { useFeatureFlags } from '~/shared/utils/hooks/useFeatureFlags';

type PublicAppletDetails = {
  isPublic: true;
  startActivityOrFlow?: string | null;
  publicAppletKey: string;
};

type PrivateAppletDetails = {
  isPublic: false;
  startActivityOrFlow?: string | null;
  appletId: string;
};

type Props = PublicAppletDetails | PrivateAppletDetails;

export const ActivityGroups = (props: Props) => {
  const { t } = useCustomTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [takeNowSuccessModalState, setTakeNowSuccessModalState] =
    useState<TakeNowSuccessModalProps>({
      isOpen: false,
    });

  const {
    isError: isAppletError,
    isLoading: isAppletLoading,
    data: applet,
  } = useAppletBaseInfoByIdQuery(props, { select: (data) => data.data.result });

  const {
    isError: isEventsError,
    isLoading: isEventsLoading,
    data: events,
  } = useEventsbyAppletIdQuery(props, {
    select: (data) => data.data.result,
  });

  const { featureFlags } = useFeatureFlags();

  const {
    isInMultiInformantFlow,
    getMultiInformantState,
    resetMultiInformantState,
    ensureMultiInformantStateExists,
  } = appletModel.hooks.useMultiInformantState();

  useOnceEffect(() => {
    ensureMultiInformantStateExists();
    if (featureFlags.enableMultiInformant) {
      if (isInMultiInformantFlow() && !props.startActivityOrFlow) {
        resetMultiInformantState();
      }

      // We rely on location state to evaluate whether to show the modal so that it only displays
      // after the activity is complete (and not when it's paused). See useEntityComplete hook.
      if (location.state?.showTakeNowSuccessModal && !takeNowSuccessModalState.isOpen) {
        navigate(window.location.pathname, {
          state: {
            ...location.state,
            showTakeNowSuccessModal: undefined,
          } as unknown,
          replace: true,
        });
        setTakeNowSuccessModalState({ isOpen: true, ...getMultiInformantState() });
      }
    }
  });

  if (isAppletLoading || isEventsLoading) {
    return <Loader />;
  }

  if (isEventsError || isAppletError) {
    return (
      <Box display="flex" width="100%" height="100%" justifyContent="center" alignItems="center">
        <span>{t('additional.invalid_public_url')}</span>
      </Box>
    );
  }

  return (
    <AppletDetailsContext.Provider value={{ ...props, applet, events }}>
      <ActivityGroupList />
      <TakeNowSuccessModal
        onClose={() => setTakeNowSuccessModalState({ isOpen: false })}
        {...takeNowSuccessModalState}
      />
    </AppletDetailsContext.Provider>
  );
};
