import { useAcceptTransferOwnershipQuery } from "../api"

import { useInvitationTranslation } from "~/entities/invitation"
import { Loader, PageMessage } from "~/shared/ui"
import { Mixpanel } from "~/shared/utils"

type TransferOwnershipProps = {
  appletId: string
  keyParam: string
}

export const TransferOwnershipAccept = ({ appletId, keyParam }: TransferOwnershipProps) => {
  const { t } = useInvitationTranslation()

  const { isLoading, isError } = useAcceptTransferOwnershipQuery(
    { appletId, key: keyParam },
    {
      onSuccess() {
        Mixpanel.track("Transfer Ownership Accepted")
      },
    },
  )

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return <PageMessage message={t("notFound")} />
  }

  return <PageMessage message={t("invitationAccepted")} />
}
