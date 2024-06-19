import { SaveAndExitButton } from '~/features/SaveAssessmentAndExit';
import ROUTES from '~/shared/constants/routes';
import Box from '~/shared/ui/Box';
import { useCustomMediaQuery, useCustomNavigation } from '~/shared/utils';

type Props = {
  errorLabel: string;

  publicAppletKey: string | null;
  appletId: string;
};

export const ErrorScreen = ({ errorLabel, publicAppletKey, appletId }: Props) => {
  const navigator = useCustomNavigation();

  const { greaterThanSM } = useCustomMediaQuery();

  const onSaveAndExitClick = () => {
    return navigator.navigate(
      publicAppletKey
        ? ROUTES.publicJoin.navigateTo(publicAppletKey)
        : ROUTES.appletDetails.navigateTo(appletId),
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
