import Nav from "react-bootstrap/Nav"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../../../app/system/routes/constants"

interface LoginButtonProps {
  closeExpandedNavbar: () => void
}

const LoginButton = ({ closeExpandedNavbar }: LoginButtonProps): JSX.Element | null => {
  const { t } = useTranslation("translation", { keyPrefix: "Navbar" })
  const navigate = useNavigate()

  const onClickHandler = () => {
    navigate(ROUTES.login.path)
    closeExpandedNavbar()
  }

  return (
    <Nav.Link onClick={onClickHandler} className="text-center">
      {t("logIn")}
    </Nav.Link>
  )
}

export default LoginButton
