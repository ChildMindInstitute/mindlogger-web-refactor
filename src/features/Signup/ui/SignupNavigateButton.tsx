import classNames from "classnames"
import { useNavigate } from "react-router-dom"

import { ROUTES } from "~/shared/constants"
import Button from "~/shared/ui/Button"
import { useCustomTranslation } from "~/shared/utils"

interface SignupNavigateButtonProps {
  redirectState?: Record<string, unknown>
}

export const SignupNavigateButton = ({ redirectState }: SignupNavigateButtonProps) => {
  const { t } = useCustomTranslation()
  const navigate = useNavigate()

  const onSignupClick = () => {
    navigate(ROUTES.signup.path, { state: redirectState })
  }

  return (
    <Button type="button" className={classNames("btn", "btn-success", "mx-1", "color-white")} onClick={onSignupClick}>
      {t("singUp")}
    </Button>
  )
}
