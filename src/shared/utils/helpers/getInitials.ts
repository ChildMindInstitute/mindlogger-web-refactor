export const getInitials = (value: string) => {
  if (value.length < 2) {
    return value
  }

  return `${value.split(" ")[0][0]}${value.split(" ")[1][0]}`
}
