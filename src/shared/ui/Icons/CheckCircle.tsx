import Box from '../Box';

type Props = {
  color?: string;
  strokeWidth?: number;

  width?: string;
  height?: string;
};

const CheckCircle = (props: Props) => {
  return (
    <Box
      display="flex"
      sx={{
        '& path': {
          strokeDasharray: 56,
          strokeDashoffset: 56,
          animation: 'draw 2s ease forwards',
        },
        '@keyframes draw': {
          to: {
            strokeDashoffset: 0,
          },
        },
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={props.strokeWidth || 1.5}
        stroke={props.color || 'currentColor'}
        width={props.width || '24px'}
        height={props.height || '24px'}
        className="checkmark-circle"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    </Box>
  );
};

export default CheckCircle;
