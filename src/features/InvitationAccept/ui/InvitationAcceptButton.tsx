import classNames from "classnames"
import { useNavigate } from "react-router-dom"

import { useAcceptInviteMutation, useInvitationTranslation } from "~/entities/invitation"
import Button from "~/shared/ui/Button"
import { Mixpanel, ROUTES } from "~/shared/utils"

interface InvitationAcceptButtonProps {
  invitationKey: string
}

export const InvitationAcceptButton = ({ invitationKey }: InvitationAcceptButtonProps) => {
  const { t } = useInvitationTranslation()
  const navigate = useNavigate()

  const { mutate: acceptInvite, isLoading: isAcceptLoading } = useAcceptInviteMutation({
    onSuccess() {
      navigate(ROUTES.invitationAccept.path)
      Mixpanel.track("Invitation Accepted")
    },
  })

  const onInviteAccept = () => {
    acceptInvite({ invitationId: invitationKey })
  }

  return (
    <Button
      onClick={onInviteAccept}
      variant="success"
      className={classNames("mx-2", "mb-2", "invitation-buttons", "color-white")}
      loading={isAcceptLoading}>
      {t("buttons.acceptInvitation")}
    </Button>
  )
}
