import Box from "@mui/material/Box"

import { useAuthorizationGuard } from "../../AuthorizationGuard"
import { FetchInvitationErrorMapper } from "./FetchInvitationErrorMapper"

import { Invitation, useInvitationQuery, useInvitationTranslation } from "~/entities/invitation"
import { InvitationAcceptButton } from "~/features/InvitationAccept"
import { InvitationDeclineButton } from "~/features/InvitationDecline"
import { Loader, Text } from "~/shared/ui"

interface FetchInvitationProps {
  keyParams: string
}

export const FetchInvitation = ({ keyParams }: FetchInvitationProps) => {
  const { t } = useInvitationTranslation()
  const { isAuthenticated } = useAuthorizationGuard()

  const { isError, data, error, isLoading } = useInvitationQuery(keyParams)

  if (isError) {
    return <FetchInvitationErrorMapper error={error} />
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" textAlign="center">
        <Text margin="12px">{t("loadingInvitation")}</Text>
        <Loader />
      </Box>
    )
  }

  return (
    <Invitation
      invite={data?.data?.result}
      isUserAuthenticated={isAuthenticated}
      actionComponent={
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="row">
          <InvitationAcceptButton invitationKey={keyParams} />
          <InvitationDeclineButton invitationKey={keyParams} />
        </Box>
      }
    />
  )
}
