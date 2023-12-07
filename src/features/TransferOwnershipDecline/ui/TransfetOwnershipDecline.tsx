import classNames from "classnames"
import { Spinner } from "react-bootstrap"

import { useDeclineTransferOwnershipQuery } from "../api"

import { useInvitationTranslation } from "~/entities/invitation"
import { PageMessage } from "~/shared/ui"
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
    return (
      <div className={classNames("d-flex", "justify-content-center", "align-items-center", "text-center")}>
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  if (isError) {
    return <PageMessage message={t("notFound")} />
  }

  return <PageMessage message={t("invitationDeclined")} />
}
