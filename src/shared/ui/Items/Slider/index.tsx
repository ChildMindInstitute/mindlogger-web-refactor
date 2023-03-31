import { useMemo } from "react"

import { Form } from "react-bootstrap"

import "./style.scss"

type SliderItemProps = {
  minImage: string | null
  minLabel: string | null
  minValue: number

  maxImage: string | null
  maxLabel: string | null
  maxValue: number

  value: string

  disabled?: boolean
  continiusSlider?: boolean
  showStickLabel?: boolean
  showStickMarks?: boolean

  onChange: (value: string) => void
}

export const SliderItem = (props: SliderItemProps) => {
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

    for (let i = 0; i < maxValue; i++) {
      stickLabels.push(i)
    }

    return stickLabels
  }, [maxValue])

  return (
    <div className={`slider-widget ${value ? "no-value" : ""}`}>
      <Form.Range
        min={minValue}
        max={maxValue}
        value={value}
        step={continiusSlider ? 0.1 : defaultStep}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
      />

      {(showStickLabel || showStickMarks) && (
        <div className="ticks">
          {stickList.map(label => {
            return (
              <span key={label} className="tick" style={{ background: showStickMarks ? "black" : "white" }}>
                {(showStickLabel && label) || ""}
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
