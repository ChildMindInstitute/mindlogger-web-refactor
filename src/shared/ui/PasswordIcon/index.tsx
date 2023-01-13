import { EyeSlash, Eye } from "react-bootstrap-icons"

interface PasswordIconProps {
  isSecure: boolean
}

export const PasswordIcon = ({ isSecure }: PasswordIconProps) => {
  return isSecure ? <EyeSlash /> : <Eye />
}
