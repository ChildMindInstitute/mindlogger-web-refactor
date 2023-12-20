import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"

import { getFirstLetters } from "../../utils"

export interface CardProps {
  id: string
  title: string
  description?: string
  imageSrc?: string
  onClick?: () => void
}

export const CustomCard = ({ id, title, description, imageSrc, onClick }: CardProps) => {
  return (
    <Card
      id={id}
      onClick={onClick}
      sx={{
        width: "280px",
        minHeight: "390px",
        margin: "20px",
        cursor: "pointer",
        boxShadow: "0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)",
      }}>
      <Box width={280} height={280}>
        {imageSrc ? (
          <CardMedia component="img" height="280px" width="280px" image={imageSrc} alt="Applet Logo" />
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            fontSize="93px"
            width={280}
            height={280}
            color="white"
            bgcolor="rgb(119, 119, 119)">
            {getFirstLetters(title)}
          </Box>
        )}
      </Box>
      <CardContent>
        <Typography gutterBottom component="div" fontSize="20px" sx={{ "&:hover": { textDecoration: "underline" } }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  )
}
