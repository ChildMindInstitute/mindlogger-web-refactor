import { PropsWithChildren } from 'react';

import SurveyHeader from './SurveyHeader';

import { Theme } from '~/shared/constants';
import { Banners, Box } from '~/shared/ui';

type Props = PropsWithChildren<{
  progress?: number;

  isSaveAndExitButtonShown: boolean;

  footerActions?: React.ReactNode;

  title?: string;
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
        progress={props.progress}
        isSaveAndExitButtonShown={props.isSaveAndExitButtonShown}
        title={props.title}
      />

      <Box
        id="assessment-content-container"
        display="flex"
        flex={1}
        flexDirection="column"
        overflow="scroll"
      >
        <Banners />
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
