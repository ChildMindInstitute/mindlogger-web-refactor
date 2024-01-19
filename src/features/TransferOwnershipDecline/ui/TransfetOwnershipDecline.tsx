import classNames from "classnames"
import { Spinner } from "react-bootstrap"

import { useDeclineTransferOwnershipQuery } from "../api"

import { PageMessage } from "~/shared/ui"
import { Mixpanel, useCustomTranslation } from "~/shared/utils"

type TransferOwnershipProps = {
  appletId: string
  keyParam: string
}

export const TransferOwnershipDecline = ({ appletId, keyParam }: TransferOwnershipProps) => {
  const { t } = useCustomTranslation()

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
    return <PageMessage message={t("transferOwnership.notFound")} />
  }

  return (
    <div
      className={classNames(
        "d-flex",
        "flex-column",
        "justify-content-center",
        "align-items-center",
        "text-center",
        "gap-3",
      )}>
      <h2>{t("transferOwnership.declined.title")}</h2>
      <h5>{t("transferOwnership.declined.message")}</h5>
    </div>
  )
}
