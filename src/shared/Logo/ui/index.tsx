import { LOGO_URL } from "../lib/constants"

export interface LogoProps {
  widthPx?: number
  heightPx?: number
}

const Logo = ({ widthPx, heightPx }: LogoProps) => {
  const defaultSize = {
    height: 50,
    width: 120,
  }

  return (
    <img
      height={heightPx || defaultSize.height}
      width={widthPx || defaultSize.width}
      className="logo mr-1 xs-display-none p-1"
      src={LOGO_URL}
      loading="lazy"
    />
  )
}

export default Logo
