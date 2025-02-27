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

import { Theme } from '~/shared/constants';
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
          backgroundColor: Theme.colors.light.surface2,
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
            color: Theme.colors.light.onSurfaceVariant,
            marginLeft: 'auto',
            cursor: 'pointer',
          }}
        />
      )}

      {title && (
        <DialogTitle id="customized-dialog-title">
          <Typography
            fontSize="22px"
            fontWeight={700}
            fontStyle="normal"
            lineHeight="28px"
            letterSpacing="0.1px"
            textTransform="none"
            paddingBottom="8px"
            color={Theme.colors.light.onSurface}
            {...titleProps}
          >
            {title}
          </Typography>
        </DialogTitle>
      )}
      {label && (
        <DialogContent>
          <Typography
            fontSize="16px"
            fontWeight={400}
            fontStyle="normal"
            lineHeight="24px"
            letterSpacing="0.15px"
            textTransform="none"
            color={Theme.colors.light.onSurface}
          >
            {label}
          </Typography>
        </DialogContent>
      )}

      {labelComponent && <DialogContent>{labelComponent}</DialogContent>}
      {(footerPrimaryButton || footerSecondaryButton) && (
        <DialogActions sx={{ ...footerWrapperSXProps }}>
          {footerSecondaryButton && (
            <Box width="120px" data-testid="assessment-back-button">
              <BaseButton
                type="button"
                variant="text"
                onClick={onSecondaryButtonClick}
                text={footerSecondaryButton}
                borderColor={Theme.colors.light.outline}
                sx={{
                  '&:hover': {
                    border: 'none',
                  },
                }}
              >
                <Typography
                  fontSize="14px"
                  fontWeight={400}
                  fontStyle="normal"
                  lineHeight="20px"
                  letterSpacing="0.1px"
                  textTransform="none"
                  color={Theme.colors.light.primary}
                >
                  {footerSecondaryButton}
                </Typography>
              </BaseButton>
            </Box>
          )}

          {footerPrimaryButton && (
            <Box minWidth="120px" data-testid="popup-primary-button">
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
