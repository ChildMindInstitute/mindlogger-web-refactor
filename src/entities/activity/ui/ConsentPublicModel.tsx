import { useState } from "react"

import { useCustomTranslation } from "~/shared/utils"
import CustomModal from "~/widgets/Modal"

export const ConsentPublicModel = () => {
  const { t } = useCustomTranslation()

  const [isOpen, setIsOpen] = useState(false)

  const onPublicClick = () => {
    setIsOpen(true)
  }

  return (
    <>
      <span role="button" onClick={onPublicClick} className="text-primary ms-1 mb-2">
        {t("data_sharing.public")}
      </span>
      <CustomModal
        show={isOpen}
        onHide={() => setIsOpen(false)}
        label={t("data_sharing.dialog.body")}
        onPrimaryButtonClick={() => setIsOpen(false)}
        footerPrimaryButton="OK"
      />
    </>
  )
}
