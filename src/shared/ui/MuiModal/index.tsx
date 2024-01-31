import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"

import { Markdown } from "~/shared/ui"

type Props = {
  isOpen: boolean
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

export const MuiModal = (props: Props) => {
  const {
    title,
    label,
    footerPrimaryButton,
    footerSecondaryButton,
    isOpen,
    primaryButtonDisabled,
    secondaryButtonDisabled,
    onHide,
    onPrimaryButtonClick,
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
        },

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
      {label && (
        <DialogContent>
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
