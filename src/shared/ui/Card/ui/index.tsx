import { Card } from "react-bootstrap"
import Avatar from "react-avatar"

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
    <Card className="applet-card" onClick={onClick} key={id}>
      <div className="applet-header">
        <div className="applet-image">
          {imageSrc ? (
            <Card.Img variant="top" src={imageSrc} />
          ) : (
            <Avatar color="#777" name={title} maxInitials={2} size="240" round="3px" />
          )}
        </div>
      </div>
      <Card.Body>
        <Card.Title className="applet-card-title">{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default CustomCard
