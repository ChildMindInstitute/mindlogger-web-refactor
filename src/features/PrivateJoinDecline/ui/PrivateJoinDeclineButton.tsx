import classNames from "classnames"
import { useNavigate } from "react-router-dom"

import { useInvitationTranslation } from "~/entities/invitation"
import { ROUTES } from "~/shared/constants"
import { useNotification } from "~/shared/ui"
import Button from "~/shared/ui/Button"

export const PrivateJoinDeclineButton = () => {
  const { t } = useInvitationTranslation()
  const navigate = useNavigate()
  const { showErrorNotification } = useNotification()

  const onInviteDecline = () => {
    showErrorNotification(t("invitationDeclined"))
    navigate(ROUTES.appletList.path)
  }

  return (
    <Button
      onClick={onInviteDecline}
      variant="danger"
      className={classNames("mx-2", "mb-2", "invitation-buttons", "color-white")}>
      {t("buttons.declineInvitation")}
    </Button>
  )
}
