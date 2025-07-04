import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import { getFirstLetters } from '../../utils';

import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';

export interface CardProps {
  id: string;
  title: string;
  description?: string;
  imageSrc?: string;
  onClick?: () => void;
}

export const CustomCard = ({ id, title, description, imageSrc, onClick }: CardProps) => {
  return (
    <Card
      id={id}
      onClick={onClick}
      data-testid="custom-card"
      sx={{
        width: '280px',
        minHeight: '390px',
        margin: '20px',
        cursor: 'pointer',
        boxShadow:
          '0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)',
      }}
    >
      <Box width={280} height={280} data-testid="custom-card-media-block">
        {imageSrc ? (
          <CardMedia
            component="img"
            height="280px"
            width="280px"
            image={imageSrc}
            alt="Applet Logo"
            data-testid="custom-card-image"
          />
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            fontSize="93px"
            width={280}
            height={280}
            color="white"
            data-testid="custom-card-image-replacement"
            bgcolor="rgb(119, 119, 119)"
          >
            {getFirstLetters(title)}
          </Box>
        )}
      </Box>
      <CardContent data-testid="custom-card-content-block">
        <Text
          gutterBottom
          variant="titleLargish"
          sx={{ wordBreak: 'break-word', '&:hover': { textDecoration: 'underline' } }}
          testid="custom-card-title"
        >
          {title}
        </Text>
        <Text variant="bodyMedium" color="text.secondary" testid="custom-card-description">
          {description}
        </Text>
      </CardContent>
    </Card>
  );
};
