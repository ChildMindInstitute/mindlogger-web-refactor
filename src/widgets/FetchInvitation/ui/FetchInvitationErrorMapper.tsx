import { InvitationErrorMessages } from "../lib/error-messages.dictionary"

import { useInvitationTranslation } from "~/entities/invitation"
import { BaseError } from "~/shared/api"
import { PageMessage } from "~/shared/ui"

type Props = {
  error: BaseError
}

export const FetchInvitationErrorMapper = ({ error }: Props) => {
  const { t } = useInvitationTranslation()

  const isInvitationProcessedError = error.evaluatedMessage === InvitationErrorMessages.hasBeenProccesed

  if (isInvitationProcessedError) {
    return <PageMessage message={t("invitationAlreadyRemoved")} />
  }

  return <PageMessage message={t("notAssociatedAccount")} />
}
