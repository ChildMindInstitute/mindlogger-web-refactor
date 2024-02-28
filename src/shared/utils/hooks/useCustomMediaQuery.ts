import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export type MediaQueryReturn = {
  greaterThanXS: boolean;

  lessThanSM: boolean;
  greaterThanSM: boolean;

  lessThanMD: boolean;
  greaterThanMD: boolean;

  lessThanLG: boolean;
  greaterThanLG: boolean;

  lessThanXL: boolean;
  greaterThanXL: boolean;
};

// Default breakpoints:
// xs, extra-small: 0px
// sm, small: 600px
// md, medium: 900px
// lg, large: 1200px
// xl, extra-large: 1536px

export const useCustomMediaQuery = (): MediaQueryReturn => {
  const theme = useTheme();

  const greaterThanXS = useMediaQuery(theme.breakpoints.up('xs'));

  const lessThanSM = useMediaQuery(theme.breakpoints.down('sm'));
  const greaterThanSM = useMediaQuery(theme.breakpoints.up('sm'));

  const lessThanMD = useMediaQuery(theme.breakpoints.down('md'));
  const greaterThanMD = useMediaQuery(theme.breakpoints.up('md'));

  const lessThanLG = useMediaQuery(theme.breakpoints.down('lg'));
  const greaterThanLG = useMediaQuery(theme.breakpoints.up('lg'));

  const lessThanXL = useMediaQuery(theme.breakpoints.down('xl'));
  const greaterThanXL = useMediaQuery(theme.breakpoints.up('xl'));

  return {
    greaterThanXS,
    lessThanSM,
    greaterThanSM,
    lessThanMD,
    greaterThanMD,
    lessThanLG,
    greaterThanLG,
    lessThanXL,
    greaterThanXL,
  };
};
