import { useMemo } from 'react';

import Box from '@mui/material/Box';

import {
  CheckboxItem,
  CustomTooltip,
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

  onChange: (value: string) => void;
  replaceText: (value: string) => string;
};

export const CheckboxItemOption = (props: Props) => {
  const onHandleChange = () => {
    return props.onChange(String(props.value));
  };

  const tooltipText = useMemo(() => {
    if (props.description) {
      return props.replaceText(props.description);
    }

    return null;
  }, [props]);

  const labelText = useMemo(() => {
    return props.replaceText(props.label);
  }, [props]);

  return (
    <SelectBaseBox
      color={props.color}
      onHandleChange={onHandleChange}
      checked={props.defaultChecked}
    >
      <CheckboxItem
        id={props.id}
        name={props.name}
        value={props.value}
        disabled={props.disabled}
        defaultChecked={props.defaultChecked}
      />

      <Box display="flex" flex={1} justifyContent="flex-start" alignItems="center" gap="12px">
        {props.image && <SelectBaseImage src={props.image} />}

        <SelectBaseText text={labelText} />
      </Box>

      {tooltipText ? (
        <CustomTooltip markdown={tooltipText} />
      ) : (
        <div className="option-tooltip"></div>
      )}
    </SelectBaseBox>
  );
};
