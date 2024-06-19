import { SaveAndExitButton } from '~/features/SaveAssessmentAndExit';
import ROUTES from '~/shared/constants/routes';
import { Box } from '~/shared/ui';
import Loader from '~/shared/ui/Loader';
import { useCustomMediaQuery, useCustomNavigation } from '~/shared/utils';

type Props = {
  appletId: string;
  publicAppletKey: string | null;
};

const LoadingScreen = ({ appletId, publicAppletKey }: Props) => {
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
        <Loader />
      </Box>
    </Box>
  );
};

export default LoadingScreen;
