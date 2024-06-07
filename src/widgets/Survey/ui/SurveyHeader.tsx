import { SaveAndExitButton } from '~/features/SaveAssessmentAndExit';
import { MultiInformantTooltip } from '~/features/TakeNow';
import { ROUTES, Theme } from '~/shared/constants';
import { BaseProgressBar, Box, Text } from '~/shared/ui';
import { useCustomMediaQuery, useCustomNavigation } from '~/shared/utils';

type Props = {
  title: string;

  appletId: string;
  activityId: string;
  eventId: string;
  isPublic: boolean;
  publicKey: string | null;

  progress?: number;
  isSaveAndExitButtonShown: boolean;
};

const SurveyHeader = (props: Props) => {
  const { greaterThanSM } = useCustomMediaQuery();
  const navigator = useCustomNavigation();

  const cutStringToLength = (str: string, length: number) => {
    return str.length > length ? `${str.substring(0, length)}...` : str;
  };

  const onSaveAndExitClick = () => {
    return navigator.navigate(
      props.isPublic && props.publicKey
        ? ROUTES.publicJoin.navigateTo(props.publicKey)
        : ROUTES.appletDetails.navigateTo(props.appletId),
    );
  };

  return (
    <Box
      id="activity-details-header"
      display="grid"
      alignItems="center"
      justifyContent="center"
      gridTemplateColumns="1fr minmax(300px, 900px) 1fr"
      padding={greaterThanSM ? '19px 24px' : '15px 16px'}
      height={87}
      gap={1.5}
      sx={{
        backgroundColor: Theme.colors.light.surface,
        borderBottom: `1px solid ${Theme.colors.light.surfaceVariant}`,
      }}
    >
      <MultiInformantTooltip />

      <Box sx={{ gridColumn: '2 / 3' }}>
        <Box
          display="flex"
          justifyContent={greaterThanSM ? 'center' : 'space-between'}
          alignItems="center"
          marginBottom={greaterThanSM ? '8px' : '10px'}
        >
          <Text
            variant="body1"
            color={Theme.colors.light.onSurface}
            testid="assessment-activity-title"
            sx={{ textAlign: greaterThanSM ? 'center' : 'left' }}
          >
            {greaterThanSM ? props.title : cutStringToLength(props.title, 30)}
          </Text>
          {!greaterThanSM && props.isSaveAndExitButtonShown && (
            <SaveAndExitButton onClick={onSaveAndExitClick} />
          )}
        </Box>
        {props.progress !== undefined && (
          <BaseProgressBar percentage={props.progress} testid="assessment-activity-progress-bar" />
        )}
      </Box>

      {greaterThanSM && props.isSaveAndExitButtonShown && (
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
      )}
    </Box>
  );
};

export default SurveyHeader;
