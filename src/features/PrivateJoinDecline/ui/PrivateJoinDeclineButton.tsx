import classNames from "classnames"
import { useNavigate } from "react-router-dom"

import { useInvitationTranslation } from "~/entities/invitation"
import { ROUTES } from "~/shared/constants"
import Button from "~/shared/ui/Button"

export const PrivateJoinDeclineButton = () => {
  const { t } = useInvitationTranslation()
  const navigate = useNavigate()

  const onInviteDecline = () => {
    navigate(ROUTES.invitationDecline.path)
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
