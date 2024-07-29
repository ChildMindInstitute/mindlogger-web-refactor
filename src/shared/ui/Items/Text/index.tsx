import { BaseTextInput, Box } from '~/shared/ui';

type Props = {
  value: string | undefined;
  onValueChange: (value: string) => void;
  disabled: boolean;
  isMultiline?: boolean;
  maxCharacters?: number;
};

export const TextItem = ({
  value = '',
  onValueChange,
  disabled,
  isMultiline,
  maxCharacters,
}: Props) => {
  const numCharacters = value.length;
  const handleOnChange = (value: string) => {
    if (isMultiline && maxCharacters && value.length > maxCharacters) {
      return;
    }

    onValueChange(value);
  };
  return (
    <Box>
      <BaseTextInput
        fullWidth
        size="small"
        value={value}
        onChange={(e) => handleOnChange(e.target.value)}
        disabled={disabled}
        multiline={isMultiline}
        minRows={isMultiline ? 5 : 1}
        maxRows={isMultiline ? 12 : 1}
        sx={
          isMultiline
            ? {
                borderRadius: '12px',
                '& .MuiInputBase-input': {
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#C2C7CF',
                    borderRadius: '100px',
                  },
                },
                '& .MuiInputBase-root': {
                  paddingRight: '2px', // Remove padding inside the input
                },
              }
            : null
        }
      />
      {isMultiline ? (
        <Box
          display="flex"
          justifyContent="flex-end" // Align the character count box to the right
          alignItems="center"
          fontSize="small"
          color="#72777F"
          mr={2}
        >{`${numCharacters}/${maxCharacters} characters`}</Box>
      ) : null}
    </Box>
  );
};
