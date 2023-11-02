import classNames from "classnames"
import { useNavigate } from "react-router-dom"

import { useAcceptPrivateInviteMutation, useInvitationTranslation } from "~/entities/invitation"
import Button from "~/shared/ui/Button"
import { Mixpanel, ROUTES } from "~/shared/utils"

interface PrivateJoinAcceptButtonProps {
  invitationKey: string
}

export const PrivateJoinAcceptButton = ({ invitationKey }: PrivateJoinAcceptButtonProps) => {
  const { t } = useInvitationTranslation()
  const navigate = useNavigate()

  const { mutate: acceptPrivateInvite, isLoading } = useAcceptPrivateInviteMutation({
    onSuccess() {
      navigate(ROUTES.invitationAccept.path)
      Mixpanel.track("Invitation Accepted")
    },
  })

  const onPrivateJoinAccept = () => {
    acceptPrivateInvite({ invitationId: invitationKey })
  }

  return (
    <Button
      onClick={onPrivateJoinAccept}
      variant="success"
      className={classNames("mx-2", "mb-2", "invitation-buttons", "color-white")}
      loading={isLoading}>
      {t("buttons.acceptInvitation")}
    </Button>
  )
}
