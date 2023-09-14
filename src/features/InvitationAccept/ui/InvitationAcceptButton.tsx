import classNames from "classnames"
import { useNavigate } from "react-router-dom"

import { useAcceptInviteMutation, useInvitationTranslation } from "~/entities/invitation"
import { ROUTES } from "~/shared/constants"
import { useToast } from "~/shared/ui"
import Button from "~/shared/ui/Button"

interface InvitationAcceptButtonProps {
  invitationKey: string
}

export const InvitationAcceptButton = ({ invitationKey }: InvitationAcceptButtonProps) => {
  const { t } = useInvitationTranslation()
  const navigate = useNavigate()

  const { showSuccessToast } = useToast()

  const { mutate: acceptInvite, isLoading: isAcceptLoading } = useAcceptInviteMutation({
    onSuccess() {
      showSuccessToast(t("invitationAccepted"))
      navigate(ROUTES.appletList.path)
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
