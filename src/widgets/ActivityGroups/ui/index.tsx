import { useState } from 'react';

import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { ActivityGroupList } from './ActivityGroupList';
import { AppletDetailsContext } from '../lib';
import { useTakeNowRedirect } from '../model/hooks/useTakeNowRedirect';

import { appletModel, useAppletBaseInfoByIdQuery } from '~/entities/applet';
import { useProlificIntegrationStateQuery } from '~/entities/applet/api/integrations/useProlificIntegrationEnabledQuery';
import { useUpdateProlificParams } from '~/entities/applet/model/hooks/useSaveProlificParams';
import { useMyAssignmentsQuery } from '~/entities/assignment';
import { useEventsbyAppletIdQuery } from '~/entities/event';
import { TakeNowSuccessModalProps } from '~/features/TakeNow/lib/types';
import { TakeNowSuccessModal } from '~/features/TakeNow/ui/TakeNowSuccessModal';
import Box from '~/shared/ui/Box';
import Loader from '~/shared/ui/Loader';
import { useCustomTranslation, useOnceEffect } from '~/shared/utils';
import { useFeatureFlags } from '~/shared/utils/hooks';
import { FeatureFlag } from '~/shared/utils/types/featureFlags';

type PublicAppletDetails = {
  isPublic: true;
  startActivityOrFlow?: string | null;
  publicAppletKey: string;
  appletId?: undefined;
};

type PrivateAppletDetails = {
  isPublic: false;
  startActivityOrFlow?: string | null;
  appletId: string;
  publicAppletKey?: undefined;
};

type Props = PublicAppletDetails | PrivateAppletDetails;

type ProlificState = {
  isError: boolean;
  paramExists: boolean;
};

export const ActivityGroups = (props: Props) => {
  const { appletId, isPublic, publicAppletKey, startActivityOrFlow } = props;
  const { t } = useCustomTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [takeNowSuccessModalState, setTakeNowSuccessModalState] =
    useState<TakeNowSuccessModalProps>({
      isOpen: false,
    });
  const { featureFlag } = useFeatureFlags();
  const isAssignmentsEnabled = featureFlag(FeatureFlag.EnableActivityAssign, false) && !isPublic;
  const [searchParams] = useSearchParams();
  const [prolificState, setProlificState] = useState<ProlificState>({
    isError: false,
    paramExists: false,
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

  const {
    isError: isAssignmentsError,
    isLoading: isAssignmentsLoading,
    data: assignments = null,
  } = useMyAssignmentsQuery(isAssignmentsEnabled ? appletId : undefined, {
    select: (data) => data.data.result.assignments,
    enabled: isAssignmentsEnabled,
  });

  const {
    isInMultiInformantFlow,
    getMultiInformantState,
    resetMultiInformantState,
    ensureMultiInformantStateExists,
  } = appletModel.hooks.useMultiInformantState();

  const { prolificPid, studyId, sessionId } = {
    prolificPid: searchParams.get('PROLIFIC_PID'),
    studyId: searchParams.get('STUDY_ID'),
    sessionId: searchParams.get('SESSION_ID'),
  };

  const isFromProlific = !!(prolificPid || studyId || sessionId);
  const hasValidProlificParams = !!(prolificPid && studyId && sessionId);

  const { data: prolificIntegrationStateResponse } = useProlificIntegrationStateQuery(
    { ...props, prolificStudyId: studyId },
    {
      enabled: prolificState.paramExists,
    },
  );

  const { saveProlificParams, clearProlificParams } = useUpdateProlificParams();

  useOnceEffect(() => {
    ensureMultiInformantStateExists();

    if (isInMultiInformantFlow() && !startActivityOrFlow) {
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

    if (isFromProlific && hasValidProlificParams) {
      saveProlificParams({ prolificPid, studyId, sessionId });
    } else {
      clearProlificParams(); // Clear any prolificParams params from global state
    }

    setProlificState({
      isError: !hasValidProlificParams,
      paramExists: isFromProlific,
    });
  });

  useTakeNowRedirect({
    activityOrFlowId: startActivityOrFlow,
    applet,
    assignments,
    events: events?.events,
    isPublic,
    publicAppletKey,
  });

  if (isAppletLoading || isEventsLoading || (isAssignmentsEnabled && isAssignmentsLoading)) {
    return <Loader />;
  }

  if (
    isEventsError ||
    isAppletError ||
    (isAssignmentsEnabled && isAssignmentsError) ||
    (prolificState.paramExists &&
      (!prolificIntegrationStateResponse?.data.enabled || prolificState.isError))
  ) {
    return (
      <Box display="flex" width="100%" height="100%" justifyContent="center" alignItems="center">
        <span>{t('additional.invalid_public_url')}</span>
      </Box>
    );
  }

  return (
    <AppletDetailsContext.Provider value={{ ...props, applet, events, assignments }}>
      <ActivityGroupList />
      <TakeNowSuccessModal
        onClose={() => setTakeNowSuccessModalState({ isOpen: false })}
        {...takeNowSuccessModalState}
      />
    </AppletDetailsContext.Provider>
  );
};
