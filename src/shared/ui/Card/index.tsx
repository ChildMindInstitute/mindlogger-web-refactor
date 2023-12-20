import classNames from "classnames"
import { Card } from "react-bootstrap"

import { getFirstLetters } from "../../utils"

import "./style.scss"

export interface CardProps {
  type: "card" | "link"
  id: string | number
  title: string
  description?: string
  buttonLabel?: string | null
  buttonOnClick?: () => void
  imageSrc?: string
  onClick?: () => void
  className?: string
}

export const CustomCard = ({
  id,
  title,
  description,
  imageSrc,
  onClick,
  buttonLabel,
  buttonOnClick,
  type,
  className,
}: CardProps) => {
  const cardAsLink = type === "link"
  const cardAsCard = type === "card"

  const styles = classNames({ "card-link-custom": cardAsLink }, { "card-custom": cardAsCard })

  return (
    <Card className={classNames(styles, className)} onClick={onClick} key={id}>
      {imageSrc ? (
        <Card.Img className="image-card-size image-size" variant="top" src={imageSrc} />
      ) : (
        <div className="image-card-size image-size">{getFirstLetters(title)}</div>
      )}
      <Card.Body className={classNames("custom-card-body")}>
        <Card.Title className={classNames({ "text-center": cardAsCard })}>{title}</Card.Title>
        {description && <Card.Text>{description}</Card.Text>}
        {/* {buttonLabel && buttonOnClick && (
          <BaseButton
            type="button"
            variant="contained"
            // className={classNames("card-button-shadow", "card-about-button")}
            // variant="link"
            onClick={buttonOnClick}
            text={buttonLabel}
          />
        )} */}
      </Card.Body>
    </Card>
  )
}
