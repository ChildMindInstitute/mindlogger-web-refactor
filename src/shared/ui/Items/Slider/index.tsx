import { useMemo } from "react"

import Slider from "@mui/material/Slider"

import { Theme } from "../../../constants"

import "./style.css"

type SliderItemProps = {
  minImage: string | null
  minLabel: string | null
  minValue: number

  maxImage: string | null
  maxLabel: string | null
  maxValue: number

  value?: string

  disabled?: boolean
  continiusSlider?: boolean
  showStickLabel?: boolean
  showStickMarks?: boolean

  onChange: (value: string) => void
}

export const SliderItemBase = (props: SliderItemProps) => {
  const {
    minLabel,
    minImage,
    minValue,
    maxLabel,
    maxImage,
    maxValue,
    value,
    onChange,
    disabled,
    continiusSlider,
    showStickLabel,
    showStickMarks,
  } = props

  const defaultStep = 1

  const stickList = useMemo(() => {
    const stickLabels = []

    for (let i = minValue; i <= maxValue; i++) {
      stickLabels.push(i)
    }

    return stickLabels
  }, [maxValue, minValue])

  return (
    <div className={`slider-widget ${value ? "no-value" : ""}`}>
      <Slider
        size="medium"
        min={minValue}
        max={maxValue}
        value={value ? Number(value) : 0}
        disabled={disabled}
        step={continiusSlider ? 0.1 : defaultStep}
        onChange={(e, value) => onChange(String(value))}
        sx={{
          height: "8px",
          color: Theme.colors.light.neutural90,
          "& .MuiSlider-thumb": {
            backgroundColor: Theme.colors.light.primary,
          },
          "& .MuiSlider-track": {
            opacity: 0,
          },
        }}
      />

      {(showStickLabel || showStickMarks) && (
        <div className="ticks">
          {stickList.map(label => {
            return (
              <span key={label} className="tick" style={{ background: showStickMarks ? "black" : "white" }}>
                {showStickLabel ? label : ""}
              </span>
            )
          })}
        </div>
      )}

      <div className="slider-description">
        <div className="first" style={{ maxWidth: `100px` }}>
          {minImage && <img src={minImage} width="100%"></img>}

          {minLabel && <div className="label">{minLabel}</div>}
        </div>
        <div className="last" style={{ maxWidth: `100px` }}>
          {maxImage && <img src={maxImage} width="100%"></img>}

          {maxLabel && <div className="label">{maxLabel}</div>}
        </div>
      </div>
    </div>
  )
}
