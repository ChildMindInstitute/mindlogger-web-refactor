import { LOGO_URL } from "../lib/constants"

export interface LogoProps {
  widthPx?: number
  heightPx?: number
  classNameExtended?: string
}

const Logo = ({ widthPx, heightPx, classNameExtended }: LogoProps) => {
  const defaultSize = {
    height: 50,
    width: 120,
  }

  const defaultClassName = "mr-1 p-1"

  return (
    <img
      height={heightPx || defaultSize.height}
      width={widthPx || defaultSize.width}
      className={classNameExtended ? `${defaultClassName} ${classNameExtended}` : defaultClassName}
      src={LOGO_URL}
      loading="lazy"
    />
  )
}

export default Logo
