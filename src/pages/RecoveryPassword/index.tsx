import Box from "@mui/material/Box"
import { useSearchParams } from "react-router-dom"

import { useRecoveryPasswordLinkHealthcheckQuery } from "~/entities/user"
import { RecoveryPasswordForm, useRecoveryPasswordTranslation } from "~/features/RecoveryPassword"
import { PageMessage } from "~/shared/ui"
import Loader from "~/shared/ui/Loader"

export default function RecoveryPasswordPage() {
  const [searchParams] = useSearchParams()
  const { t } = useRecoveryPasswordTranslation()

  const key = searchParams.get("key")
  const email = searchParams.get("email")

  const { isError, isLoading, error } = useRecoveryPasswordLinkHealthcheckQuery({ email: email!, key: key! })

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return <PageMessage message={error.evaluatedMessage!} />
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
