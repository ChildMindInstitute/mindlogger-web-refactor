import Box from "@mui/material/Box"

import { useAuthorizationGuard } from "../../AuthorizationGuard"
import { FetchInvitationErrorMapper } from "./FetchInvitationErrorMapper"

import { Invitation, useInvitationQuery, useInvitationTranslation } from "~/entities/invitation"
import { InvitationAcceptButton } from "~/features/InvitationAccept"
import { InvitationDeclineButton } from "~/features/InvitationDecline"
import { Loader, Text } from "~/shared/ui"
import { useCustomMediaQuery } from "~/shared/utils"

interface FetchInvitationProps {
  keyParams: string
}

export const FetchInvitation = ({ keyParams }: FetchInvitationProps) => {
  const { t } = useInvitationTranslation()
  const { isAuthenticated } = useAuthorizationGuard()
  const { lessThanSM } = useCustomMediaQuery()

  const { isError, data, error, isLoading } = useInvitationQuery(keyParams)

  if (isError) {
    return <FetchInvitationErrorMapper error={error} />
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" textAlign="center">
        <Text variant="body1" margin="12px">
          {t("loadingInvitation")}
        </Text>
        <Loader />
      </Box>
    )
  }

  return (
    <Invitation
      invite={data?.data?.result}
      isUserAuthenticated={isAuthenticated}
      actionComponent={
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection={lessThanSM ? "column" : "row"}
          gap="12px"
          margin="16px 0px">
          <InvitationAcceptButton invitationKey={keyParams} />
          <InvitationDeclineButton invitationKey={keyParams} />
        </Box>
      }
    />
  )
}
