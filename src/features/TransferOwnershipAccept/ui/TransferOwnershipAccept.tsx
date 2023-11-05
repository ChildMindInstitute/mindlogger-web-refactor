import classNames from "classnames"
import { Spinner } from "react-bootstrap"

import { useAcceptTransferOwnershipQuery } from "../api"

import { useInvitationTranslation } from "~/entities/invitation"
import { PageMessage } from "~/shared/ui"

type TransferOwnershipProps = {
  appletId: string
  keyParam: string
}

export const TransferOwnershipAccept = ({ appletId, keyParam }: TransferOwnershipProps) => {
  const { t } = useInvitationTranslation()

  const { isLoading, isError } = useAcceptTransferOwnershipQuery({ appletId, key: keyParam })

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

  return <PageMessage message={t("invitationAccepted")} />
}
