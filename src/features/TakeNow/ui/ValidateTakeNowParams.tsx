import { useEffect } from 'react';

import { appletModel } from '~/entities/applet';
import { TakeNowParams } from '~/features/TakeNow/lib/TakeNowParams.types';
import { useTakeNowValidation } from '~/features/TakeNow/lib/useTakeNowValidation';
import { useNotification } from '~/shared/ui';
import Loader from '~/shared/ui/Loader';
import { ActivityGroups } from '~/widgets/ActivityGroups';

function ValidateTakeNowParams({
  appletId,
  subjectId: targetSubjectId,
  startActivityOrFlow,
  respondentId,
}: TakeNowParams) {
  const { showErrorNotification } = useNotification();
  const { initiateTakeNow, isInMultiInformantFlow, getMultiInformantState } =
    appletModel.hooks.useMultiInformantState();

  const { isError, isLoading, isSuccess, error, data } = useTakeNowValidation({
    appletId,
    subjectId: targetSubjectId,
    startActivityOrFlow,
    respondentId,
  });

  useEffect(() => {
    if (isSuccess && data) {
      const { sourceSubjectId, targetSubjectId } = data;

      const multiInformantState = getMultiInformantState();
      if (
        !isInMultiInformantFlow() ||
        sourceSubjectId !== multiInformantState.sourceSubjectId ||
        targetSubjectId !== multiInformantState.targetSubjectId
      ) {
        initiateTakeNow({ sourceSubjectId, targetSubjectId });
      }
    }
  }, [data, initiateTakeNow, isInMultiInformantFlow, isSuccess]);

  useEffect(() => {
    if (error) {
      showErrorNotification(error, {
        allowDuplicate: false,
        duration: 7000,
      });
    }
  }, [error, showErrorNotification]);

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
