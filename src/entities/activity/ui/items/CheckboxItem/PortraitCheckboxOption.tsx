import { useMemo } from 'react';

import { Box } from '~/shared/ui';
import {
  CheckboxItem,
  CustomTooltip,
  SelectBaseBox,
  SelectBaseImage,
  SelectBaseText,
} from '~/shared/ui';
import { cutString } from '~/shared/utils';

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

export const PortraitCheckboxOption = (props: Props) => {
  const tooltipText = useMemo(() => {
    if (props.description) {
      return props.replaceText(props.description);
    }

    return null;
  }, [props]);

  const labelText = useMemo(() => {
    return props.replaceText(props.label);
  }, [props]);

  const cutTheTextBasedOnOptionParams = (text: string) => {
    if (props.image && !tooltipText) {
      return cutString(text, 21);
    }

    if (props.image && tooltipText) {
      return cutString(text, 12);
    }

    return cutString(text, 25);
  };

  const hasImage = !!props.image;

  return (
    <SelectBaseBox
      color={props.color}
      onHandleChange={() => props.onChange(String(props.value))}
      checked={props.defaultChecked}
      padding="8px 8px"
      sx={{ minHeight: '188px', width: '148px', alignItems: !hasImage ? 'center' : undefined }}
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
          <CheckboxItem
            id={props.id}
            name={props.name}
            value={props.value}
            disabled={props.disabled}
            defaultChecked={props.defaultChecked}
          />

          <SelectBaseText text={cutTheTextBasedOnOptionParams(labelText)} />

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
