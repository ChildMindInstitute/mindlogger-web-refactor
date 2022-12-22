import { Modal } from "react-bootstrap"
import Button from "../../Button"

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
            <Button variant="primary" onClick={onPrimaryButtonClick}>
              {footerPrimaryButton}
            </Button>
          )}
          {footerSecondaryButton && (
            <Button variant="secondary" onClick={onSecondaryButtonClick}>
              {footerSecondaryButton}
            </Button>
          )}
        </Modal.Footer>
      )}
    </Modal>
  )
}

export default CustomModal
