import { ActivityGroupList } from './ActivityGroupList';
import { AppletDetailsContext } from '../lib';

import { appletModel, useAppletBaseInfoByIdQuery } from '~/entities/applet';
import { useEventsbyAppletIdQuery } from '~/entities/event';
import { TakeNowSuccessModal } from '~/features/TakeNow/ui/TakeNowSuccessModal';
import Box from '~/shared/ui/Box';
import Loader from '~/shared/ui/Loader';
import { useCustomTranslation, useOnceEffect } from '~/shared/utils';
import { useFeatureFlags } from '~/shared/utils/hooks/useFeatureFlags';

type PublicProps = {
  isPublic: true;
  startActivityOrFlow?: string | null;
  publicAppletKey: string;
};

type PrivateProps = {
  isPublic: false;
  startActivityOrFlow?: string | null;
  appletId: string;
};

type Props = PublicProps | PrivateProps;

export const ActivityGroups = (props: Props) => {
  const { t } = useCustomTranslation();

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

  const { isInMultiInformantFlow, resetMultiInformantState, ensureMultiInformantStateExists } =
    appletModel.hooks.useMultiInformantState();

  useOnceEffect(() => {
    ensureMultiInformantStateExists();
    if (featureFlags.enableMultiInformant) {
      if (isInMultiInformantFlow() && !props.startActivityOrFlow) {
        resetMultiInformantState();
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
      <TakeNowSuccessModal />
    </AppletDetailsContext.Provider>
  );
};
