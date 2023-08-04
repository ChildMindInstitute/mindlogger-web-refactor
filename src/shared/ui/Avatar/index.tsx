import Avatar from "@mui/material/Avatar"

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
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    }
  }

  return <Avatar {...avatarOptions(name, src)} alt={`${name} image`} sx={{ width, height }} />
}
