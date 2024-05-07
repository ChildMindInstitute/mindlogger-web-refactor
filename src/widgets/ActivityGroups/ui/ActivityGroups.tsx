import { ActivityGroupList } from './ActivityGroupList';
import { AppletDetailsContext } from '../lib';

import { appletModel, useAppletBaseInfoByIdQuery } from '~/entities/applet';
import { useEventsbyAppletIdQuery } from '~/entities/event';
import { TakeNowSuccessModal } from '~/features/TakeNow/ui/TakeNowSuccessModal';
import { Container } from '~/shared/ui';
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

  const {
    isError: isAppletError,
    isLoading: isAppletLoading,
    data: applet,
  } = useAppletBaseInfoByIdQuery(props, { select: (data) => data.data.result });

  if (applet) {
    applet.integrations = ['loris'];
  }

  const {
    isError: isEventsError,
    isLoading: isEventsLoading,
    data: events,
  } = useEventsbyAppletIdQuery(props, {
    select: (data) => data.data.result,
  });

  const { featureFlags } = useFeatureFlags();

  const { isInMultiInformantFlow, resetMultiInformantState } =
    appletModel.hooks.useMultiInformantState();

  useOnceEffect(() => {
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
      <Container
        sx={{
          display: 'flex',
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <span>{t('additional.invalid_public_url')}</span>
      </Container>
    );
  }

  return (
    <AppletDetailsContext.Provider value={{ ...props, applet, events }}>
      <ActivityGroupList />
      <TakeNowSuccessModal />
    </AppletDetailsContext.Provider>
  );
};
