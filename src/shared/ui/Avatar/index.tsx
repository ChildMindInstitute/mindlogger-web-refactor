import Avatar from "@mui/material/Avatar"

import { getInitials } from "../../utils"

type Props = {
  src?: string
  name: string

  width?: string
  height?: string
}

export const AvatarBase = ({ src, name, width = "32px", height = "32px" }: Props) => {
  const avatarOptions = (name: string, src?: string) => {
    if (src) {
      return {
        src,
      }
    }

    return {
      children: getInitials(name),
    }
  }

  return <Avatar {...avatarOptions(name, src)} alt={`${name} image`} sx={{ width, height }} />
}
