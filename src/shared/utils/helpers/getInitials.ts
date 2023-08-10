export const getInitials = (value: string) => {
  return `${value.split(" ")[0][0]}${value.split(" ")[1][0]}`
}
