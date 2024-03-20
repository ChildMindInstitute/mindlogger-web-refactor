import { PropsWithChildren, forwardRef } from 'react';

import { SxProps } from '@mui/material';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { Theme } from '../../constants';

type Props = PropsWithChildren<{
  type: 'button' | 'submit';
  isLoading?: boolean;
  disabled?: boolean;
  variant: 'text' | 'contained' | 'outlined';
  borderColor?: string;

  text?: string | null;
  onClick?: () => void;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

  sx?: SxProps;
}>;

type ButtonTextComponentProps = {
  text?: string | null;
  textComponent?: React.ReactNode;
};

const ButtonTextComponent = (props: ButtonTextComponentProps): JSX.Element => {
  if (props.textComponent) {
    return <>{props.textComponent}</>;
  }

  return (
    <Typography
      fontFamily="Atkinson"
      fontSize="16px"
      fontWeight={700}
      fontStyle="normal"
      lineHeight="20px"
      letterSpacing="0.1px"
      textTransform="none"
    >
      {props.text}
    </Typography>
  );
};

export const BaseButton = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  return (
    <Button
      ref={ref}
      type={props.type}
      variant={props.variant}
      disabled={props.isLoading || props.disabled}
      onClick={props.onClick}
      color={props.color ?? undefined}
      sx={{
        borderRadius: '100px',
        maxWidth: '400px',
        width: '100%',
        padding: '10px 24px',
        height: '48px',
        fontFamily: 'Atkinson',
        fontSize: '16px',
        fontWeight: 700,
        fontStyle: 'normal',
        lineHeight: '20px',
        borderColor: props.borderColor ?? undefined,
        '&:hover': {
          border: `1px solid ${props.borderColor}`,
        },
        ...props.sx,
      }}
    >
      {props.isLoading ? (
        <CircularProgress size={25} sx={{ color: Theme.colors.light.primary }} />
      ) : (
        <ButtonTextComponent text={props.text} textComponent={props.children} />
      )}
    </Button>
  );
});

BaseButton.displayName = 'BaseButton';
