import Box from "@mui/material/Box"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Typography from "@mui/material/Typography"

import { BaseButton } from "../BaseButton"

import { Theme } from "~/shared/constants"

type Props = {
  isOpen: boolean
  onHide: () => void
  title?: string | null
  label?: string | null
  footerPrimaryButton?: string | null
  primaryButtonDisabled?: boolean
  isPrimaryButtonLoading?: boolean
  onPrimaryButtonClick?: () => void
  footerSecondaryButton?: string | null
  secondaryButtonDisabled?: boolean
  onSecondaryButtonClick?: () => void
  isSecondaryButtonLoading?: boolean
}

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
  } = props

  return (
    <Dialog
      open={isOpen}
      onClose={onHide}
      maxWidth="xs"
      fullWidth
      aria-labelledby="customized-dialog-title"
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "16px",
          padding: "24px",
        },
        "& .MuiDialogTitle-root": {
          padding: "0",
        },
        "& .MuiDialogContent-root": {
          padding: "0",
        },
        "& .MuiDialogActions-root": {
          justifyContent: "center",
          paddingTop: "24px",
        },
      }}>
      {title && (
        <DialogTitle id="customized-dialog-title">
          <Typography
            fontFamily="Atkinson"
            fontSize="22px"
            fontWeight={700}
            fontStyle="normal"
            lineHeight="28px"
            letterSpacing="0.1px"
            textTransform="none"
            paddingBottom="8px"
            color={Theme.colors.light.onSurface}>
            {title}
          </Typography>
        </DialogTitle>
      )}
      {label && (
        <DialogContent>
          <Typography
            fontFamily="Atkinson"
            fontSize="16px"
            fontWeight={400}
            fontStyle="normal"
            lineHeight="24px"
            letterSpacing="0.15px"
            textTransform="none"
            color={Theme.colors.light.onSurface}>
            {label}
          </Typography>
        </DialogContent>
      )}
      {(footerPrimaryButton || footerSecondaryButton) && (
        <DialogActions>
          {footerSecondaryButton && (
            <Box width="120px" data-testid="assessment-back-button">
              <BaseButton
                type="button"
                variant="text"
                onClick={onSecondaryButtonClick}
                text={footerSecondaryButton}
                borderColor={Theme.colors.light.outline}
                sx={{
                  "&:hover": {
                    border: "none",
                  },
                }}>
                <Typography
                  fontFamily="Atkinson"
                  fontSize="14px"
                  fontWeight={400}
                  fontStyle="normal"
                  lineHeight="20px"
                  letterSpacing="0.1px"
                  textTransform="none"
                  color={Theme.colors.light.primary}>
                  {footerSecondaryButton}
                </Typography>
              </BaseButton>
            </Box>
          )}

          {footerPrimaryButton && (
            <Box width="120px" data-testid="popup-primary-button">
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
  )
}