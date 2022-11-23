import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"

import LanguageDropdown from "../../languageDropdown"

import "./header.scss"
import LoginButton from "../../loginButton"
import { ROUTES } from "../../../app/system/routes/constants"

const Header = (): JSX.Element | null => {
  const { t } = useTranslation("translation", { keyPrefix: "Navbar" })
  const navigate = useNavigate()

  const onLogoClickHandler = () => {
    navigate(ROUTES.main.path)
  }

  return (
    <Navbar expand="md" variant="dark" className="header">
      <Navbar.Brand role="button" onClick={onLogoClickHandler}>
        {t("mindLogger")}
      </Navbar.Brand>

      <Navbar.Collapse>
        <Nav className="ms-auto">
          <Row>
            <Col xs={12} md={6} className="App container justify-content-center">
              <LanguageDropdown />
            </Col>
            <Col xs={12} md={6} className="App container justify-content-center">
              <LoginButton />
            </Col>
          </Row>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
