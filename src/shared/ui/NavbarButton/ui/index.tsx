import Nav from "react-bootstrap/Nav"

export interface NavbarButton {
  label: string
  onClick: () => void
}

const NavbarButton = ({ label, onClick }: NavbarButton): JSX.Element | null => {
  return (
    <Nav.Link onClick={onClick} className="text-center">
      {label}
    </Nav.Link>
  )
}

export default NavbarButton
