import { Theme } from '../../../constants';

import { Box } from '~/shared/ui';

export const BaseCheckboxIcon = () => {
  return (
    <Box
      component="span"
      borderRadius="3px"
      width="24px"
      height="24px"
      boxShadow={`inset 0 0 0 2px ${Theme.colors.light.outlineVariant}, inset 0 -1px 0 ${Theme.colors.light.outlineVariant}`}
      sx={{
        '.Mui-focusVisible &': {
          outline: `2px auto ${Theme.colors.light.primary}`,
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
