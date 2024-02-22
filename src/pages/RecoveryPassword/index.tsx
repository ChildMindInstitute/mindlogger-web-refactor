import Box from "@mui/material/Box"
import { useSearchParams } from "react-router-dom"

import { useRecoveryPasswordLinkHealthcheckQuery } from "~/entities/user"
import { RecoveryPasswordForm, useRecoveryPasswordTranslation } from "~/features/RecoveryPassword"
import Loader from "~/shared/ui/Loader"
import { Text } from "~/shared/ui/Text"

export default function RecoveryPasswordPage() {
  const [searchParams] = useSearchParams()
  const { t } = useRecoveryPasswordTranslation()

  const key = searchParams.get("key")
  const email = searchParams.get("email")

  const { isError, isLoading } = useRecoveryPasswordLinkHealthcheckQuery({ email: email!, key: key! })

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return (
      <Box display="flex" flex={1} justifyContent="center" alignItems="center" textAlign="center">
        <Text variant="body1" fontSize="24px" margin="16px 0px">
          <Box dangerouslySetInnerHTML={{ __html: t("invalidLink") }} />
        </Text>
      </Box>
    )
  }

  return (
    <Box display="flex" flex={1} justifyContent="center" textAlign="center" padding={3} margin={3}>
      <Box textAlign="center" marginY={2} paddingX={3} flex={1}>
        <Box>
          <h3 className="text-primary">{t("title")}</h3>
        </Box>

        <RecoveryPasswordForm title={t("formTitle", { email })} token={key} email={email} />
      </Box>
    </Box>
  )
}
