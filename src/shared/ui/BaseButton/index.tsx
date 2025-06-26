import { PropsWithChildren, forwardRef } from 'react';

import { SxProps } from '@mui/material';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { variables } from '~/shared/constants/theme/variables';
import Text from '~/shared/ui/Text';

type Props = PropsWithChildren<{
  type: 'button' | 'submit';
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'contained' | 'outlined' | 'text' | 'elevated' | 'tonal' | 'textNeutral';
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
    <Text variant="titleMediumBold" component="p" sx={{ textTransform: 'none' }}>
      {props.text}
    </Text>
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
        maxWidth: '400px',
        width: '100%',
        ...props.sx,
      }}
    >
      {props.isLoading ? (
        <CircularProgress size={25} sx={{ color: variables.palette.primary }} />
      ) : (
        <ButtonTextComponent text={props.text} textComponent={props.children} />
      )}
    </Button>
  );
});

BaseButton.displayName = 'BaseButton';
