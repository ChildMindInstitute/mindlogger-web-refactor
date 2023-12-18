import { useDeclineTransferOwnershipQuery } from "../api"

import { useInvitationTranslation } from "~/entities/invitation"
import { Loader, PageMessage } from "~/shared/ui"
import { Mixpanel } from "~/shared/utils"

type TransferOwnershipProps = {
  appletId: string
  keyParam: string
}

export const TransferOwnershipDecline = ({ appletId, keyParam }: TransferOwnershipProps) => {
  const { t } = useInvitationTranslation()

  const { isLoading, isError } = useDeclineTransferOwnershipQuery(
    { appletId, key: keyParam },
    {
      onSuccess() {
        Mixpanel.track("Transfer Ownership Declined")
      },
    },
  )

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return <PageMessage message={t("notFound")} />
  }

  return <PageMessage message={t("invitationDeclined")} />
}
