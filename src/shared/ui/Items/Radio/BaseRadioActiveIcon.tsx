import Box from '@mui/material/Box';

import { Theme } from '../../../constants/theme';

export const BaseRadioActiveIcon = () => {
  return (
    <Box
      component="span"
      borderRadius="50%"
      width="24px"
      height="24px"
      sx={{
        '.Mui-focusVisible &': {
          outline: `2px auto ${Theme.colors.light.primary}`,
          outlineOffset: 2,
        },
        'input:disabled ~ &': {
          boxShadow: 'none',
          background: 'rgba(206,217,224,.5)',
        },
        backgroundColor: Theme.colors.light.primary,
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        '&:before': {
          display: 'block',
          width: 24,
          height: 24,
          backgroundImage: 'radial-gradient(#fff,#fff 24%,transparent 0%)',
          content: '""',
        },
        'input:hover ~ &': {
          backgroundColor: Theme.colors.light.primary,
        },
      }}
    ></Box>
  );
};
