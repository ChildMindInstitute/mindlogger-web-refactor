import { useContext, useState } from 'react';

import Container from '@mui/material/Container';
import { subMonths } from 'date-fns';

import { ActivityGroup } from './ActivityGroup';
import { AppletDetailsContext } from '../lib';
import { useActivityGroups, useEntitiesSync, useIntegrationsSync } from '../model/hooks';

import AppletDefaultIcon from '~/assets/AppletDefaultIcon.svg';
import { useCompletedEntitiesQuery } from '~/entities/activity';
import { BootstrapModal } from '~/shared/ui';
import { AvatarBase } from '~/shared/ui';
import Box from '~/shared/ui/Box';
import Loader from '~/shared/ui/Loader';
import Text from '~/shared/ui/Text';
import { formatToDtoDate, useCustomTranslation } from '~/shared/utils';

export const ActivityGroupList = () => {
  const { t } = useCustomTranslation();

  const { applet, events, isPublic } = useContext(AppletDetailsContext);

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

  const { groups } = useActivityGroups({ applet, events });

  const onCardAboutClick = () => {
    if (!isAppletAboutExist) return;

    setIsAboutOpen(true);
  };

  useEntitiesSync({ completedEntities });

  if (isCompletedEntitiesFetching) {
    return <Loader />;
  }

  return (
    <Container sx={{ flex: '1' }}>
      <Box display="flex" gap="16px" marginTop="24px" alignItems="center">
        <AvatarBase
          src={isAppletImageExist ? applet.image : AppletDefaultIcon}
          name={applet.displayName}
          width="48px"
          height="48px"
          variant="rounded"
          testid="applet-image"
        />
        <Text
          variant="h4"
          onClick={onCardAboutClick}
          testid="applet-name"
          sx={{
            fontFamily: 'Atkinson',
            fontSize: '22px',
            fontWeight: 400,
            lineHeight: '28px',
            fontStyle: 'normal',
            cursor: isAppletAboutExist ? 'pointer' : 'default',
            wordBreak: 'break-word',
          }}
        >
          {applet.displayName}
        </Text>
      </Box>

      <Box>
        {/* <SharedContentConsent appletId={applet.id} /> */}

        {groups
          .filter((g) => g.activities.length)
          .map((g) => (
            <ActivityGroup group={g} key={g.name} />
          ))}
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
