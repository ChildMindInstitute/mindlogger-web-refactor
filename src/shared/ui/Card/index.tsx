import { Card } from "react-bootstrap"

import { getFirstLetters } from "../../utils"

import "./style.scss"

export interface CardProps {
  id: string | number
  title: string
  description?: string
  imageSrc?: string
  onClick?: () => void
  className?: string
}

export const CustomCard = ({ id, title, description, imageSrc, onClick, className = "" }: CardProps) => {
  return (
    <Card className={`card-link-custom ${className}`} onClick={onClick} key={id}>
      {imageSrc ? (
        <Card.Img className="image-card-size image-size" variant="top" src={imageSrc} />
      ) : (
        <div className="image-card-size image-size">{getFirstLetters(title)}</div>
      )}
      <Card.Body className="custom-card-body">
        <Card.Title>{title}</Card.Title>
        {description && <Card.Text>{description}</Card.Text>}
      </Card.Body>
    </Card>
  )
}
