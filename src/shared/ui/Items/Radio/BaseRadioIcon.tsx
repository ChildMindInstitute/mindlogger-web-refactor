import { variables } from '~/shared/constants/theme/variables';
import { Box } from '~/shared/ui';

export const BaseRadioIcon = () => {
  return (
    <Box
      component="span"
      borderRadius="50%"
      width="24px"
      height="24px"
      boxShadow={`inset 0 0 0 2px ${variables.palette.outlineVariant}, inset 0 -1px 0 ${variables.palette.outlineVariant}`}
      sx={{
        '.Mui-focusVisible &': {
          outline: `2px auto ${variables.palette.primary}`,
          outlineOffset: 2,
        },
        'input:disabled ~ &': {
          boxShadow: 'none',
          background: 'rgba(206,217,224,.5)',
        },
      }}
    ></Box>
  );
};
