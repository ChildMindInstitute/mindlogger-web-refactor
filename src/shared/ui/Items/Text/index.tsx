import { Theme } from '~/shared/constants';
import { BaseTextInput } from '~/shared/ui';

type Props = {
  value: string | undefined;
  onValueChange: (value: string) => void;
  disabled: boolean;
  isMultiline?: boolean;
  hasError?: boolean;
};

export const TextItem = ({ value = '', onValueChange, disabled, isMultiline, hasError }: Props) => {
  const handleOnChange = (value: string) => {
    onValueChange(value);
  };
  return (
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
              '& .MuiInputBase-input': {
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#C2C7CF',
                },
              },
              '& .MuiInputBase-root': {
                paddingRight: '2px', // Reduce padding inside the input
                ...(hasError ? { border: `2px  solid ${Theme.colors.light.error}` } : {}),
                borderWidth: '2px',
                borderRadius: '20px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: hasError ? 'none' : `2px solid ${Theme.colors.light.outline}`,
              },
            }
          : null
      }
    />
  );
};
