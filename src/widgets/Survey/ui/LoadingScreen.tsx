import { SaveAndExitButton } from '~/features/SaveAssessmentAndExit';
import { Box } from '~/shared/ui';
import Loader from '~/shared/ui/Loader';
import { useCustomMediaQuery } from '~/shared/utils';

type Props = {
  appletId: string;
  publicAppletKey: string | null;
};

const LoadingScreen = ({ appletId, publicAppletKey }: Props) => {
  const { greaterThanSM } = useCustomMediaQuery();

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
          <SaveAndExitButton appletId={appletId} publicAppletKey={publicAppletKey} />
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
