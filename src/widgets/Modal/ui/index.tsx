import { Modal } from "react-bootstrap"

import { BasicButton, Markdown } from "~/shared/ui"

import "./style.scss"

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

const CustomModal = (props: CustomModalProps) => {
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
    <Modal show={show} onHide={onHide} animation={true} className="modal-align-center">
      {title && (
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}
      {label && (
        <Modal.Body>
          <Markdown markdown={label} />
        </Modal.Body>
      )}
      {(footerPrimaryButton || footerSecondaryButton) && (
        <Modal.Footer>
          {footerSecondaryButton && (
            <BasicButton variant="secondary" onClick={onSecondaryButtonClick} disabled={secondaryButtonDisabled}>
              {footerSecondaryButton}
            </BasicButton>
          )}
          {footerPrimaryButton && (
            <BasicButton variant="primary" onClick={onPrimaryButtonClick} disabled={primaryButtonDisabled}>
              {footerPrimaryButton}
            </BasicButton>
          )}
        </Modal.Footer>
      )}
    </Modal>
  )
}

export default CustomModal
