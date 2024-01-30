import CloseIcon from "@mui/icons-material/Close"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import IconButton from "@mui/material/IconButton"

import { Markdown } from "~/shared/ui"

export interface CustomModalProps {
  show: boolean
  onHide: () => void
  title?: string | null
  label?: string | null
  footerPrimaryButton?: string | null
  primaryButtonDisabled?: boolean
  onPrimaryButtonClick?: () => void
  footerSecondaryButton?: string | null
  secondaryButtonDisabled?: boolean
  onSecondaryButtonClick?: () => void
}

export const BootstrapModal = (props: CustomModalProps) => {
  const {
    title,
    label,
    footerPrimaryButton,
    footerSecondaryButton,
    show,
    primaryButtonDisabled,
    secondaryButtonDisabled,
    onHide,
    onPrimaryButtonClick,
    onSecondaryButtonClick,
  } = props

  return (
    <Dialog
      open={show}
      onClose={onHide}
      maxWidth="xs"
      fullWidth
      aria-labelledby="customized-dialog-title"
      sx={{
        "& .MuiDialogContent-root": {
          padding: 2,
        },
        "& .MuiDialogActions-root": {
          padding: 1,
        },
      }}>
      {title && (
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {title}
        </DialogTitle>
      )}
      <IconButton
        aria-label="close"
        onClick={onHide}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: theme => theme.palette.grey[500],
        }}>
        <CloseIcon />
      </IconButton>
      {label && (
        <DialogContent dividers>
          <Markdown markdown={label} />
        </DialogContent>
      )}
      {(footerPrimaryButton || footerSecondaryButton) && (
        <DialogActions>
          {footerSecondaryButton && (
            <Button onClick={onSecondaryButtonClick} disabled={secondaryButtonDisabled}>
              {footerSecondaryButton}
            </Button>
          )}

          {footerPrimaryButton && (
            <Button onClick={onPrimaryButtonClick} disabled={primaryButtonDisabled}>
              {footerPrimaryButton}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  )
}
