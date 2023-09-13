import { useMemo } from "react"

import Box from "@mui/material/Box"
import Radio from "@mui/material/Radio"
import Typography from "@mui/material/Typography"

import { Theme } from "../../../constants"
import { CustomTooltip } from "../../Tooltip"
import { BaseRadioActiveIcon } from "./BaseRadioActiveIcon"
import { BaseRadioIcon } from "./BaseRadioIcon"
import { RadioBox } from "./RadioBox"
import { RadioImage } from "./RadioImage"

type RadioItemOptionProps = {
  id: string
  name: string
  value: string | number
  label: string

  description: string | null
  image: string | null
  disabled?: boolean
  defaultChecked?: boolean
  color: string | null

  onChange: (value: string) => void
  replaceText: (value: string) => string
}

export const RadioItemOption = (props: RadioItemOptionProps) => {
  const { id, name, value, label, description, image, disabled, defaultChecked, color, onChange, replaceText } = props

  const onHandleChange = () => {
    return onChange(String(value))
  }

  const tooltipText = useMemo(() => {
    if (description) {
      return replaceText(description)
    }

    return null
  }, [description, replaceText])

  const labelText = useMemo(() => {
    return replaceText(label)
  }, [replaceText, label])

  return (
    <RadioBox color={color} onHandleChange={onHandleChange} checked={defaultChecked}>
      <Radio
        id={id}
        name={name}
        value={value}
        disabled={disabled}
        checked={defaultChecked}
        disableRipple
        color="default"
        checkedIcon={<BaseRadioActiveIcon />}
        icon={<BaseRadioIcon />}
      />

      <Box display="flex" flex={1} justifyContent="flex-start" alignItems="center" gap="12px">
        {image && <RadioImage src={image} size="medium" />}

        <Typography
          variant="body1"
          color={Theme.colors.light.onSurface}
          fontFamily="Atkinson"
          fontSize="18px"
          fontStyle="normal"
          fontWeight={400}
          lineHeight="28px"
          sx={{ cursor: "pointer" }}>
          {labelText}
        </Typography>
      </Box>

      {tooltipText ? <CustomTooltip markdown={tooltipText} /> : <div className="option-tooltip"></div>}
    </RadioBox>
  )
}
