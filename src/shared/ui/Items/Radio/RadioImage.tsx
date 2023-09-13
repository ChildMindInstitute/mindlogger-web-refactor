import Avatar from "@mui/material/Avatar"

type Props = {
  src: string
  size: "medium" | "small"
}

export const RadioImage = (props: Props) => {
  const width = props.size === "medium" ? "64px" : "44px"
  const height = props.size === "medium" ? "64px" : "44px"

  return <Avatar src={props.src} sx={{ width, height }} variant="rounded" />
}
