import { useNavigate } from "react-router-dom"

import { ROUTES } from "../../../app/system/routes/constants"
import { useCustomTranslation } from "../../../utils/hooks/useCustomTranslation"

import NavbarButton from "../../../shared/NavbarButton"

export interface LoginButtonProps {
  onClickExtended?: () => void
}

const LoginButton = ({ onClickExtended }: LoginButtonProps) => {
  const { t } = useCustomTranslation({ keyPrefix: "Navbar" })
  const navigate = useNavigate()

  const onLoginButtonClickHandler = () => {
    navigate(ROUTES.login.path)

    if (onClickExtended) {
      onClickExtended()
    }
  }

  return <NavbarButton label={t("logIn")} onClick={onLoginButtonClickHandler} />
}

export default LoginButton
