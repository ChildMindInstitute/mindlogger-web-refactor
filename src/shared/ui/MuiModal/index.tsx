import { DOMAttributes } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Breakpoint } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { DialogProps } from '@mui/material/Dialog/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { SxProps } from '@mui/material/styles';
import Typography, { TypographyProps } from '@mui/material/Typography';

import { variables } from '~/shared/constants/theme/variables';
import { BaseButton, Box } from '~/shared/ui';

type Props = {
  isOpen: boolean;
  onHide?: DOMAttributes<SVGSVGElement>['onClick'];
  title?: string | null;
  label?: string | null;
  footerPrimaryButton?: string | null;
  primaryButtonDisabled?: boolean;
  isPrimaryButtonLoading?: boolean;
  onPrimaryButtonClick?: () => void;
  footerSecondaryButton?: string | null;
  secondaryButtonDisabled?: boolean;
  onSecondaryButtonClick?: () => void;
  isSecondaryButtonLoading?: boolean;
  canStackButtons?: boolean;
  testId?: string;
  showCloseIcon?: boolean;
  titleProps?: TypographyProps;
  labelComponent?: JSX.Element;
  footerWrapperSXProps?: SxProps;
  maxWidth?: Breakpoint;
  DialogProps?: Omit<DialogProps, 'open'>;
};

export const MuiModal = (props: Props) => {
  const {
    title,
    label,

    isOpen,
    onHide,

    footerPrimaryButton,
    onPrimaryButtonClick,
    isPrimaryButtonLoading,

    footerSecondaryButton,
    onSecondaryButtonClick,
    testId,
    showCloseIcon,
    titleProps,
    labelComponent,
    footerWrapperSXProps,
    maxWidth = 'xs',
    canStackButtons = false,
    DialogProps,
  } = props;

  return (
    <Dialog
      data-testid={testId}
      open={isOpen}
      onClose={onHide}
      maxWidth={maxWidth}
      fullWidth
      aria-labelledby="customized-dialog-title"
      sx={{
        '& .MuiPaper-root': {
          borderRadius: '16px',
          padding: '24px',
          backgroundColor: variables.palette.surface2,
        },
        '& .MuiDialogTitle-root': {
          padding: '0',
        },
        '& .MuiDialogContent-root': {
          padding: '0',
        },
        '& .MuiDialogActions-root': {
          justifyContent: 'center',
          paddingTop: '24px',
        },
      }}
      {...DialogProps}
    >
      {showCloseIcon && (
        <CloseIcon
          onClick={onHide}
          data-testid="customized-dialog-close-icon"
          sx={{
            color: variables.palette.onSurfaceVariant,
            marginLeft: 'auto',
            cursor: 'pointer',
          }}
        />
      )}

      {title && (
        <DialogTitle id="customized-dialog-title">
          <Typography
            variant="titleLargeBold"
            textTransform="none"
            paddingBottom="8px"
            color={variables.palette.onSurface}
            {...titleProps}
          >
            {title}
          </Typography>
        </DialogTitle>
      )}
      {label && (
        <DialogContent>
          <Typography variant="bodyLarge" textTransform="none" color={variables.palette.onSurface}>
            {label}
          </Typography>
        </DialogContent>
      )}

      {labelComponent && <DialogContent>{labelComponent}</DialogContent>}
      {(footerPrimaryButton || footerSecondaryButton) && (
        <DialogActions
          sx={{
            ...footerWrapperSXProps,
            flexDirection: { xs: canStackButtons ? 'column' : 'row' },
          }}
        >
          {footerSecondaryButton && (
            <Box
              width={{ xs: canStackButtons ? '100%' : '120px', sm: '120px' }}
              sx={{ order: { xs: canStackButtons ? 2 : 'initial' } }}
              data-testid="assessment-back-button"
            >
              <BaseButton
                type="button"
                variant="text"
                onClick={onSecondaryButtonClick}
                text={footerSecondaryButton}
                borderColor={variables.palette.outline}
                sx={{
                  '&:hover': {
                    border: 'none',
                  },
                }}
              >
                <Typography
                  variant="labelLarge"
                  textTransform="none"
                  color={variables.palette.primary}
                >
                  {footerSecondaryButton}
                </Typography>
              </BaseButton>
            </Box>
          )}

          {footerPrimaryButton && (
            <Box
              minWidth={{ xs: canStackButtons ? '100%' : '120px', sm: '120px' }}
              sx={{
                marginBottom: { xs: canStackButtons ? '8px' : 0 },
                marginLeft: { xs: canStackButtons ? '0 !important' : '8px !important' },
              }}
              data-testid="popup-primary-button"
            >
              <BaseButton
                type="button"
                variant="contained"
                isLoading={isPrimaryButtonLoading}
                onClick={onPrimaryButtonClick}
                text={footerPrimaryButton}
              />
            </Box>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};
