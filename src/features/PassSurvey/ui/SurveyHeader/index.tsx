import { useContext } from 'react';

import { SurveyContext } from '../../lib';
import { EntityTimer } from '../EntityTimer';

import { SaveAndExitButton } from '~/features/SaveAssessmentAndExit';
import { MultiInformantTooltip } from '~/features/TakeNow';
import { Theme } from '~/shared/constants';
import { AvatarBase, BaseProgressBar, Box, Text } from '~/shared/ui';
import { HourMinute, isStringExist, useCustomMediaQuery } from '~/shared/utils';

type Props = {
  title?: string;
  progress?: number;
  isSaveAndExitButtonShown: boolean;

  entityTimer?: HourMinute;
};

const SurveyHeader = (props: Props) => {
  const context = useContext(SurveyContext);

  const { greaterThanSM } = useCustomMediaQuery();

  const cutStringToLength = (str: string, length: number) => {
    return str.length > length ? `${str.substring(0, length)}...` : str;
  };

  const title = props.title ?? context.activity.name;

  const isProgressDefined = props.progress !== undefined;

  const titleMarginBottom = greaterThanSM ? '8px' : '10px';

  return (
    <Box
      paddingX={greaterThanSM ? '24px' : '16px'}
      paddingY={greaterThanSM ? '19px' : '15px'}
      sx={{
        backgroundColor: Theme.colors.light.surface,
        borderBottom: `1px solid ${Theme.colors.light.surfaceVariant}`,
      }}
    >
      {!greaterThanSM && (
        <Box marginBottom="8px">
          {props.entityTimer && <EntityTimer entityTimerSettings={props.entityTimer} />}
          <MultiInformantTooltip />
        </Box>
      )}

      <Box
        id="activity-details-header"
        display="grid"
        gridAutoFlow="column"
        alignItems="center"
        justifyContent="center"
        gridTemplateColumns="1fr minmax(300px, 900px) 1fr"
        gap={1.5}
      >
        {greaterThanSM && props.entityTimer && (
          <Box flex={1}>
            <EntityTimer entityTimerSettings={props.entityTimer} />
          </Box>
        )}

        {greaterThanSM && <MultiInformantTooltip />}

        <Box gridColumn="2/3">
          <Box
            display="flex"
            justifyContent={greaterThanSM ? 'center' : 'space-between'}
            alignItems="center"
            marginBottom={isProgressDefined ? titleMarginBottom : undefined}
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
                {greaterThanSM ? title : cutStringToLength(title, 30)}
              </Text>
            </Box>
            {!greaterThanSM && props.isSaveAndExitButtonShown && (
              <SaveAndExitButton
                publicAppletKey={context.publicAppletKey}
                appletId={context.appletId}
              />
            )}
          </Box>

          {isProgressDefined && (
            <BaseProgressBar
              percentage={props.progress as number}
              testid="assessment-activity-progress-bar"
            />
          )}
        </Box>

        {greaterThanSM && props.isSaveAndExitButtonShown && (
          <Box
            width="125px"
            height="100%"
            gridColumn="3/4"
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
    </Box>
  );
};

export default SurveyHeader;
