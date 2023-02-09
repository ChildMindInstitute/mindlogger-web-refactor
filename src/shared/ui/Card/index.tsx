import classNames from "classnames"
import { Card } from "react-bootstrap"

import { getFirstLetters } from "../../utils"
import Button from "../Button"

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
}

const CustomCard = ({ id, title, description, imageSrc, onClick, buttonLabel, buttonOnClick, type }: CardProps) => {
  const cardAsLink = type === "link"
  const cardAsCard = type === "card"

  const styles = classNames({ "card-link-custom": cardAsLink }, { "card-custom": cardAsCard })

  return (
    <Card className={styles} onClick={onClick} key={id}>
      {imageSrc ? (
        <Card.Img className="image-card-size image-size" variant="top" src={imageSrc} />
      ) : (
        <div className="image-card-size image-size">{getFirstLetters(title)}</div>
      )}
      <Card.Body className={classNames("custom-card-body")}>
        <Card.Title className={classNames({ "text-center": cardAsCard })}>{title}</Card.Title>
        {description && <Card.Text>{description}</Card.Text>}
        {buttonLabel && buttonOnClick && (
          <Button
            className={classNames("card-button-shadow", "card-about-button")}
            variant="link"
            onClick={buttonOnClick}>
            {buttonLabel}
          </Button>
        )}
      </Card.Body>
    </Card>
  )
}

export default CustomCard
