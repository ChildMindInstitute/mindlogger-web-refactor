import { PropsWithChildren } from 'react';

import { SxProps } from '@mui/material';

import { Theme } from '~/shared/constants';
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
  const borderColor = props.checked
    ? Theme.colors.light.primary
    : Theme.colors.light.surfaceVariant;
  const backgroundColor = props.checked
    ? Theme.colors.light.secondaryContainer
    : Theme.colors.light.surface;
  const hoverBackgroundColor = props.checked
    ? Theme.colors.light.secondaryContainerHover
    : Theme.colors.light.onSurfaceOpacity008;

  const activeBackgroundColor = props.checked
    ? hoverBackgroundColor
    : Theme.colors.light.neutural90;

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
          background: hoverBackgroundColor,
        },
        '&:active': {
          background: activeBackgroundColor,
        },
      }}
    >
      {props.children}
    </Box>
  );
};
