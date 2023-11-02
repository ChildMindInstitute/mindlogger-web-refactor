import "./style.scss"

type SplashScreenItemProps = {
  imageSrc: string
}

export const SplashScreenItem = ({ imageSrc }: SplashScreenItemProps) => {
  return (
    <div className="splash-container">
      <img src={imageSrc} className="image-splash" />
    </div>
  )
}
