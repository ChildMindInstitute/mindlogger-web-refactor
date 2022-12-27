import { Modal } from "react-bootstrap"
import { BasicButton } from "~/shared"

export interface CustomModalProps {
  show: boolean
  onHide: () => void
  title?: string
  label?: string
  footerPrimaryButton?: string
  onPrimaryButtonClick?: () => void
  footerSecondaryButton?: string
  onSecondaryButtonClick?: () => void
}

const CustomModal = (props: CustomModalProps) => {
  const {
    title,
    label,
    footerPrimaryButton,
    footerSecondaryButton,
    show,
    onHide,
    onPrimaryButtonClick,
    onSecondaryButtonClick,
  } = props

  return (
    <Modal show={show} onHide={onHide} animation={true}>
      {title && (
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}
      {label && <Modal.Body>{label}</Modal.Body>}
      {(footerPrimaryButton || footerSecondaryButton) && (
        <Modal.Footer>
          {footerPrimaryButton && (
            <BasicButton variant="primary" onClick={onPrimaryButtonClick}>
              {footerPrimaryButton}
            </BasicButton>
          )}
          {footerSecondaryButton && (
            <BasicButton variant="secondary" onClick={onSecondaryButtonClick}>
              {footerSecondaryButton}
            </BasicButton>
          )}
        </Modal.Footer>
      )}
    </Modal>
  )
}

export default CustomModal
