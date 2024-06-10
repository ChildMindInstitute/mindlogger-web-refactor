import { useContext } from 'react';

import { SurveyBasicContext } from '../lib';

import { SaveAndExitButton } from '~/features/SaveAssessmentAndExit';
import ROUTES from '~/shared/constants/routes';
import Box from '~/shared/ui/Box';
import { useCustomMediaQuery, useCustomNavigation } from '~/shared/utils';

type Props = {
  errorLabel: string;
};

export const ErrorScreen = ({ errorLabel }: Props) => {
  const navigator = useCustomNavigation();

  const context = useContext(SurveyBasicContext);

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
      <Box
        display="flex"
        justifyContent="flex-end"
        padding={greaterThanSM ? '19px 24px' : '15px 16px'}
      >
        <Box
          width="125px"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          justifySelf="flex-end"
        >
          <SaveAndExitButton onClick={onSaveAndExitClick} />
        </Box>
      </Box>

      <Box
        id="assessment-content-container"
        display="flex"
        flex={1}
        flexDirection="column"
        overflow="auto"
      >
        <Box flex={1} display="flex" justifyContent="center" alignItems="center">
          <span>{errorLabel}</span>
        </Box>
      </Box>
    </Box>
  );
};
