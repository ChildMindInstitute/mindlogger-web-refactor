export const invertColor = (hex: string) => {
  if (!hex.includes("#")) {
    return "#333333"
  }
  const hexcolor = hex.replace("#", "")
  const r = parseInt(hexcolor.substring(0, 2), 16)
  const g = parseInt(hexcolor.substring(2, 4), 16)
  const b = parseInt(hexcolor.substring(4, 6), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? "#333333" : "white"
}
