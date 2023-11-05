import { EyeSlash, Eye } from "react-bootstrap-icons"

interface PasswordIconProps {
  isSecure: boolean
  onClick: () => void
}

export const PasswordIcon = ({ isSecure, onClick }: PasswordIconProps) => {
  return isSecure ? <EyeSlash onClick={onClick} /> : <Eye onClick={onClick} />
}
