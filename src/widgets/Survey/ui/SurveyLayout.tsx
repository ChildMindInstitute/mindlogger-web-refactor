import { PropsWithChildren } from 'react';

import SurveyHeader from './SurveyHeader';

import { Theme } from '~/shared/constants';
import { Box } from '~/shared/ui';
import { NotificationCenter } from '~/shared/ui';

type Props = PropsWithChildren<{
  activityName: string;
  progress?: number;

  isPublic: boolean;
  publicAppletKey: string | null;

  appletId: string;
  activityId: string;
  eventId: string;

  isSaveAndExitButtonShown: boolean;

  footerActions?: React.ReactNode;
}>;

const SurveyLayout = (props: Props) => {
  return (
    <Box
      id="assessment-screen-layout"
      display="flex"
      flex={1}
      flexDirection="column"
      bgcolor={Theme.colors.light.surface}
    >
      <SurveyHeader
        title={props.activityName}
        progress={props.progress}
        appletId={props.appletId}
        activityId={props.activityId}
        eventId={props.eventId}
        isPublic={props.isPublic}
        publicKey={props.isPublic ? props.publicAppletKey : null}
        isSaveAndExitButtonShown={props.isSaveAndExitButtonShown}
      />

      <Box
        id="assessment-content-container"
        display="flex"
        flex={1}
        flexDirection="column"
        overflow="scroll"
      >
        <NotificationCenter />
        <Box display="flex" flex={1} justifyContent="center">
          {props.children}
        </Box>
      </Box>

      <Box
        sx={{
          borderTop: `1px solid ${Theme.colors.light.surfaceVariant}`,
        }}
      >
        {props.footerActions}
      </Box>
    </Box>
  );
};

export default SurveyLayout;
