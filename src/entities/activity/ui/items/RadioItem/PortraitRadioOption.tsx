import { useMemo } from 'react';

import {
  Box,
  CustomTooltip,
  RadioOption,
  SelectBaseBox,
  SelectBaseImage,
  SelectBaseText,
} from '~/shared/ui';

type Props = {
  id: string;
  name: string;
  value: string | number;
  label: string;

  description: string | null;
  image: string | null;
  disabled?: boolean;
  defaultChecked?: boolean;
  color: string | null;

  onChange: () => void;
  replaceText: (value: string) => string;
};

export const PortraitRadioOption = (props: Props) => {
  const tooltipText = useMemo(() => {
    if (props.description) {
      return props.replaceText(props.description);
    }

    return null;
  }, [props]);

  const labelText = useMemo(() => {
    return props.replaceText(props.label);
  }, [props]);

  const hasImage = !!props.image;

  return (
    <SelectBaseBox
      color={props.color}
      onHandleChange={props.onChange}
      checked={props.defaultChecked}
      padding="8px 8px"
      sx={{ minHeight: '188px', alignItems: !hasImage ? 'center' : undefined }}
    >
      <Box display="flex" flex={1} flexDirection="column" gap="12px" alignItems="center">
        {props.image && (
          <SelectBaseImage src={props.image} width="124px" height="124px" borderRadius="8px" />
        )}

        <Box
          display="flex"
          flex={1}
          justifyContent="space-between"
          alignItems="center"
          maxHeight="84px"
          gap="6px"
        >
          <RadioOption
            id={props.id}
            name={props.name}
            value={props.value}
            disabled={props.disabled}
            defaultChecked={props.defaultChecked}
          />

          <SelectBaseText text={labelText} />

          {tooltipText ? (
            <CustomTooltip markdown={tooltipText} />
          ) : (
            <div className="option-tooltip"></div>
          )}
        </Box>
      </Box>
    </SelectBaseBox>
  );
};
