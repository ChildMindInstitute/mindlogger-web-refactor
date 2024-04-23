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
  const { initiateTakeNow, getMultiInformantState } = appletModel.hooks.useMultiInformantState();

  const { isError, isLoading, isSuccess, error, data } = useTakeNowValidation({
    appletId,
    subjectId: targetSubjectId,
    startActivityOrFlow,
    respondentId,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    if (error) {
      showErrorNotification(error, {
        allowDuplicate: false,
        duration: 7000,
      });
    }

    // If there's no error message, then we fall back to the ActivityGroups error handling
    return <ActivityGroups isPublic={false} appletId={appletId} />;
  }

  if (isSuccess && data) {
    const multiInformantState = getMultiInformantState();
    const { sourceSubjectId, targetSubjectId } = data;

    if (
      !multiInformantState ||
      !multiInformantState.sourceSubjectId ||
      !multiInformantState.targetSubjectId
    ) {
      if (sourceSubjectId !== targetSubjectId) {
        initiateTakeNow({ sourceSubjectId, targetSubjectId });
      }
    }

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
