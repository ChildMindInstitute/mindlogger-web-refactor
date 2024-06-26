import { useContext } from 'react';

import { SurveyContext } from '~/features/PassSurvey';
import { SaveAndExitButton } from '~/features/SaveAssessmentAndExit';
import { MultiInformantTooltip } from '~/features/TakeNow';
import { Theme } from '~/shared/constants';
import { AvatarBase, BaseProgressBar, Box, ClockIcon, Text } from '~/shared/ui';
import { isStringExist, useCustomMediaQuery } from '~/shared/utils';

type Props = {
  progress?: number;
  isSaveAndExitButtonShown: boolean;

  entityTimer?: string;
};

const SurveyHeader = (props: Props) => {
  const context = useContext(SurveyContext);

  const { greaterThanSM } = useCustomMediaQuery();

  const cutStringToLength = (str: string, length: number) => {
    return str.length > length ? `${str.substring(0, length)}...` : str;
  };

  return (
    <Box
      id="activity-details-header"
      display="grid"
      alignItems="center"
      justifyContent="center"
      gridTemplateColumns="1fr minmax(300px, 900px) 1fr"
      padding={greaterThanSM ? '19px 24px' : '15px 16px'}
      height={100}
      gap={1.5}
      sx={{
        backgroundColor: Theme.colors.light.surface,
        borderBottom: `1px solid ${Theme.colors.light.surfaceVariant}`,
      }}
    >
      {props.entityTimer && (
        <Box display="flex" padding="8px 12px" gap="8px">
          <ClockIcon width="24px" height="24px" color={Theme.colors.light.outline} />
          <Text color={Theme.colors.light.outline}>{props.entityTimer}</Text>
        </Box>
      )}
      <MultiInformantTooltip />

      <Box sx={{ gridColumn: '2 / 3' }}>
        <Box
          display="flex"
          justifyContent={greaterThanSM ? 'center' : 'space-between'}
          alignItems="center"
          marginBottom={greaterThanSM ? '8px' : '10px'}
        >
          <Box display="flex" alignItems="center" gap="8px">
            {isStringExist(context.watermark) && (
              <AvatarBase borderRadius="50%" height="36px" width="36px" src={context.watermark} />
            )}
            <Text
              variant="body1"
              color={Theme.colors.light.onSurface}
              testid="assessment-activity-title"
              sx={{ textAlign: greaterThanSM ? 'center' : 'left' }}
            >
              {greaterThanSM ? context.activity.name : cutStringToLength(context.activity.name, 30)}
            </Text>
          </Box>
          {!greaterThanSM && props.isSaveAndExitButtonShown && (
            <SaveAndExitButton
              publicAppletKey={context.publicAppletKey}
              appletId={context.appletId}
            />
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
          <SaveAndExitButton
            publicAppletKey={context.publicAppletKey}
            appletId={context.appletId}
          />
        </Box>
      )}
    </Box>
  );
};

export default SurveyHeader;
