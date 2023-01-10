import { Card } from "react-bootstrap"

import "./style.scss"

export interface CardProps {
  id: string
  title: string
  description: string
  imageSrc?: string
  onClick: () => void
}

const CustomCard = ({ id, title, description, imageSrc, onClick }: CardProps) => {
  return (
    <Card className="card-custom" onClick={onClick} key={id}>
      {imageSrc ? (
        <Card.Img className="image-card-size" variant="top" src={imageSrc} />
      ) : (
        <div className="image-card-size"></div>
      )}
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default CustomCard
