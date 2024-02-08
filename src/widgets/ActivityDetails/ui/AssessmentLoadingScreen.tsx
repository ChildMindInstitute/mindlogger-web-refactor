import { useContext } from 'react';

import Box from '@mui/material/Box';

import { ActivityDetailsContext } from '../lib';

import { SaveAndExitButton } from '~/features/SaveAssessmentAndExit';
import { ROUTES } from '~/shared/constants';
import { NotificationCenter } from '~/shared/ui';
import Loader from '~/shared/ui/Loader';
import { useCustomMediaQuery, useCustomNavigation } from '~/shared/utils';

export const AssessmentLoadingScreen = () => {
  const navigator = useCustomNavigation();

  const context = useContext(ActivityDetailsContext);

  const { greaterThanSM } = useCustomMediaQuery();

  const onSaveAndExitClick = () => {
    const publicKey = context.isPublic ? context.publicAppletKey : null;

    return navigator.navigate(
      context.isPublic && publicKey
        ? ROUTES.publicJoin.navigateTo(publicKey)
        : ROUTES.appletDetails.navigateTo(context.appletId),
    );
  };

  return (
    <Box id="assessment-screen-layout" display="flex" flex={1} flexDirection="column">
      <Box display="flex" justifyContent="flex-end" padding={greaterThanSM ? '19px 24px' : '15px 16px'}>
        <Box
          width="125px"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          justifySelf="flex-end">
          <SaveAndExitButton onClick={onSaveAndExitClick} />
        </Box>
      </Box>

      <Box id="assessment-content-container" display="flex" flex={1} flexDirection="column" overflow="auto">
        <NotificationCenter />
        <Loader />
      </Box>
    </Box>
  );
};
