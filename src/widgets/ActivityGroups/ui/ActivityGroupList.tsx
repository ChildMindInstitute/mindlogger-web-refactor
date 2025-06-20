import { useContext, useMemo, useState } from 'react';

import { Container } from '@mui/material';
import { subMonths } from 'date-fns';

import { AppletDetailsContext } from '../lib';
import { ActivityGroup } from './ActivityGroup';
import { EmptyState } from './EmptyState';
import { useActivityGroups, useEntitiesSync, useIntegrationsSync } from '../model/hooks';

import { ActivityGroupType } from '~/abstract/lib/GroupBuilder';
import AppletDefaultIcon from '~/assets/AppletDefaultIcon.svg';
import ChecklistIcon from '~/assets/checklist-icon.svg';
import { useCompletedEntitiesQuery } from '~/entities/activity';
import { AvatarBase, BootstrapModal } from '~/shared/ui';
import Box from '~/shared/ui/Box';
import Loader from '~/shared/ui/Loader';
import Text from '~/shared/ui/Text';
import { formatToDtoDate, useCustomTranslation } from '~/shared/utils';

export const ActivityGroupList = () => {
  const { t } = useCustomTranslation();

  const { applet, events, assignments, isPublic } = useContext(AppletDetailsContext);

  useIntegrationsSync({ appletDetails: applet });

  const { data: completedEntities, isFetching: isCompletedEntitiesFetching } =
    useCompletedEntitiesQuery(
      {
        appletId: applet.id,
        version: applet.version,
        fromDate: formatToDtoDate(subMonths(new Date(), 1)),
      },
      { select: (data) => data.data.result, enabled: !isPublic },
    );

  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const isAppletAboutExist = Boolean(applet?.about);
  const isAppletImageExist = Boolean(applet?.image);

  const { groups } = useActivityGroups({ applet, events, assignments });

  const renderedGroups = useMemo(() => {
    const hasActivities = groups.some((g) => g.activities.length);

    if (hasActivities) {
      // Only show the available group if there are no in-progress activities
      const showAvailableGroup = !groups.some(
        (g) => g.type === ActivityGroupType.InProgress && g.activities.length,
      );

      // Filter out empty groups, but show the available group based on above logic
      return groups
        .filter(
          (g) =>
            g.activities.length || (g.type === ActivityGroupType.Available && showAvailableGroup),
        )
        .map((g) => <ActivityGroup key={g.name} group={g} />);
    } else {
      return <EmptyState flex={1} icon={ChecklistIcon} description={t('noActivities')} />;
    }
  }, [groups, t]);

  const onCardAboutClick = () => {
    if (!isAppletAboutExist) return;

    setIsAboutOpen(true);
  };

  useEntitiesSync({ completedEntities });

  if (isCompletedEntitiesFetching) {
    return <Loader />;
  }

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
      <Box display="flex" gap="16px" marginY="24px" alignItems="center">
        <AvatarBase
          src={isAppletImageExist ? applet.image : AppletDefaultIcon}
          name={applet.displayName}
          width="48px"
          height="48px"
          variant="rounded"
          testid="applet-image"
        />
        <Text
          variant="titleLarge"
          onClick={onCardAboutClick}
          testid="applet-name"
          sx={{
            cursor: isAppletAboutExist ? 'pointer' : 'default',
            wordBreak: 'break-word',
          }}
        >
          {applet.displayName}
        </Text>
      </Box>

      <Box display="flex" flexDirection="column" flex={1} gap="48px">
        {/* The consent to share content is temporarly hidden due to UI changes. */}
        {/* Need to clarify with BA`s or something. If the component is no need anymore the component/slice/other business logic related to this feature should be removed */}
        {/* <SharedContentConsent appletId={applet.id} /> */}

        {renderedGroups}
      </Box>
      <BootstrapModal
        show={isAboutOpen}
        onHide={() => setIsAboutOpen(false)}
        title={t('about')}
        label={applet.about ? applet.about : t('no_markdown')}
      />
    </Container>
  );
};
