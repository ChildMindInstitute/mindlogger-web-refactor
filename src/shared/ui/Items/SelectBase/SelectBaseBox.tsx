import { PropsWithChildren } from 'react';

import { SxProps } from '@mui/material';

import { variables } from '~/shared/constants/theme/variables';
import { Box } from '~/shared/ui';

type Props = PropsWithChildren<{
  padding?: string;
  flex?: number;
  justifyContent?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  color: string | null;
  checked?: boolean | undefined;
  onHandleChange: () => void;

  sx?: SxProps;
}>;

export const SelectBaseBox = (props: Props) => {
  const borderColor = props.checked ? variables.palette.primary : variables.palette.surfaceVariant;
  const backgroundColor = props.checked
    ? variables.palette.secondaryContainer
    : variables.palette.surface;
  const hoverBackground = props.checked
    ? `linear-gradient(${variables.palette.onSurfaceVariantAlpha8}, ${variables.palette.onSurfaceVariantAlpha8}), ${variables.palette.secondaryContainer}`
    : variables.palette.primaryAlpha8;

  const activeBackground = props.checked
    ? `linear-gradient(${variables.palette.onSurfaceVariantAlpha12}, ${variables.palette.onSurfaceVariantAlpha12}), ${variables.palette.secondaryContainer}`
    : variables.palette.primaryAlpha12;

  return (
    <Box
      display="flex"
      flex={props.flex}
      alignItems="center"
      justifyContent={props.justifyContent ? props.justifyContent : 'space-between'}
      gap="12px"
      className="response-option"
      borderRadius="12px"
      padding={props.padding ? props.padding : '16px'}
      border={`2px solid ${borderColor}`}
      bgcolor={props.color ? props.color : backgroundColor}
      onClick={props.onHandleChange}
      data-testid="select-box"
      sx={{
        ...(props.sx ?? {}),
        transition: 'background-color 0.2s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          background: hoverBackground,
        },
        '&:active': {
          background: activeBackground,
        },
      }}
    >
      {props.children}
    </Box>
  );
};
