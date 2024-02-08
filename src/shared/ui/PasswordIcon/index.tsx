import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import IconButton from '@mui/material/IconButton';

interface PasswordIconProps {
  isSecure: boolean;
  onClick?: () => void;
}

export const PasswordIcon = ({ isSecure, onClick }: PasswordIconProps) => {
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <IconButton
      aria-label="toggle password visibility"
      onClick={onClick}
      onMouseDown={handleMouseDownPassword}
      edge="end">
      {isSecure ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
    </IconButton>
  );
};
