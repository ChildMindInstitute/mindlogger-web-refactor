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
      maxRows={isMultiline ? 21 : 1}
      sx={
        isMultiline
          ? {
              '& .MuiInputBase-input': {
                height: '100%',
                maxHeight: '350px',
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#C2C7CF',
                },
              },
              '& .MuiInputBase-root': {
                height: '100%',
                paddingRight: '2px',
                ...(hasError ? { border: `2px solid ${Theme.colors.light.error}` } : {}),
                borderWidth: '2px',
                borderRadius: '12px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: hasError ? 'none' : `2px solid ${Theme.colors.light.surfaceVariant}`,
              },
            }
          : null
      }
    />
  );
};
