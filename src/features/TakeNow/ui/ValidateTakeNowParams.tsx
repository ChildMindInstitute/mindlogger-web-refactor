import { useEffect } from 'react';

import { appletModel } from '~/entities/applet';
import { useBanners } from '~/entities/banner/model';
import { useLogout } from '~/features/Logout';
import { TakeNowParams } from '~/features/TakeNow/lib/types';
import { useTakeNowValidation } from '~/features/TakeNow/lib/useTakeNowValidation';
import ROUTES from '~/shared/constants/routes';
import Loader from '~/shared/ui/Loader';
import { useCustomNavigation } from '~/shared/utils';
import { ActivityGroups } from '~/widgets/ActivityGroups';

function ValidateTakeNowParams({
  appletId,
  targetSubjectId,
  sourceSubjectId,
  startActivityOrFlow,
  respondentId,
}: TakeNowParams) {
  const { addErrorBanner } = useBanners();
  const { initiateTakeNow, isInMultiInformantFlow, getMultiInformantState } =
    appletModel.hooks.useMultiInformantState();
  const { navigate } = useCustomNavigation();
  const { logout } = useLogout();

  const { isError, isLoading, isSuccess, error, data } = useTakeNowValidation({
    appletId,
    targetSubjectId,
    sourceSubjectId,
    startActivityOrFlow,
    respondentId,
  });

  useEffect(() => {
    if (isSuccess && data) {
      const { currentUserSubject, sourceSubject, targetSubject } = data;

      const multiInformantState = getMultiInformantState();
      if (
        !isInMultiInformantFlow() ||
        currentUserSubject.id !== multiInformantState?.currentUserSubject?.id ||
        sourceSubject.id !== multiInformantState?.sourceSubject?.id ||
        targetSubject.id !== multiInformantState?.targetSubject?.id
      ) {
        initiateTakeNow({ currentUserSubject, sourceSubject, targetSubject });
      }
    }
  }, [data, initiateTakeNow, isInMultiInformantFlow, isSuccess]);

  useEffect(() => {
    if (error) {
      let duration: number | null = 15000;

      if (error.type === 'mismatchedRespondent') {
        logout();
        duration = null;
      } else if (error.type === 'invalidApplet') {
        navigate(ROUTES.appletList.path);
      }

      setTimeout(() =>
        addErrorBanner({
          children: error.error,
          duration,
        }),
      );
    }
  }, [error, addErrorBanner]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    // If there's no error message, then we fall back to the ActivityGroups error handling
    return <ActivityGroups isPublic={false} appletId={appletId} />;
  }

  if (isSuccess) {
    return (
      <ActivityGroups
        isPublic={false}
        appletId={appletId}
        startActivityOrFlow={startActivityOrFlow}
      />
    );
  }

  return null;
}

export default ValidateTakeNowParams;
