import { PropsWithChildren } from 'react';

import SurveyHeader from './SurveyHeader';

import { variables } from '~/shared/constants/theme/variables';
import { Banners, Box } from '~/shared/ui';
import { HourMinute } from '~/shared/utils';

type Props = PropsWithChildren<{
  title?: string;
  progress?: number;
  entityTimer?: HourMinute;

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
      bgcolor={variables.palette.surface}
    >
      <SurveyHeader
        progress={props.progress}
        isSaveAndExitButtonShown={props.isSaveAndExitButtonShown}
        entityTimer={props.entityTimer}
        title={props.title}
      />

      <Banners />

      <Box
        id="assessment-content-container"
        display="flex"
        flex={1}
        flexDirection="column"
        overflow="scroll"
        sx={{ containerType: 'size' }}
      >
        <Box display="flex" flex={1} justifyContent="center">
          {props.children}
        </Box>
      </Box>

      <Box
        sx={{
          borderTop: `1px solid ${variables.palette.surfaceVariant}`,
        }}
      >
        {props.footerActions}
      </Box>
    </Box>
  );
};

export default SurveyLayout;
