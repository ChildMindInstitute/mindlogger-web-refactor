import { ActivityDTO, CheckboxItemDTO, RadioItemDTO, TextItemDTO, SliderItemDTO } from "~/shared/api"

export const textItemMock: TextItemDTO = {
  id: "text-item-id",
  name: "text item name",
  question: "Text item mock question 1?",
  responseType: "text",
  responseValues: null,
  order: 1,
  config: {
    maxResponseLength: 300, // default 300
    correctAnswerRequired: false, // default false
    correctAnswer: "", // default ""
    numericalResponseRequired: false, // default ""
    responseDataIdentifier: "", // default ""
    responseRequired: false, // default false
    removeBackButton: false,
    skippableItem: false,
  },
}

export const checkboxItemMock: CheckboxItemDTO = {
  id: "checkbox-item-id",
  name: "checkox item name",
  question: "Checkbox item mock question 2?",
  responseType: "multiSelect",
  responseValues: {
    options: [
      {
        id: "mock-option-1",
        text: "Mock option 1",
        isHidden: false,
        image: null,
        score: null,
        tooltip: null,
        color: null,
      },
      {
        id: "mock-option-2",
        text: "Mock option 2",
        isHidden: false,
        image: null,
        score: null,
        tooltip: null,
        color: null,
      },
      {
        id: "mock-option-3",
        text: "Mock option 3",
        isHidden: false,
        image: null,
        score: null,
        tooltip: null,
        color: null,
      },
    ],
  },
  order: 2,
  config: {
    removeBackButton: false,
    skippableItem: false,
    randomizeOptions: false,
    timer: null,
    addScores: false,
    setAlerts: false,
    addTooltip: false,
    setPalette: false,
    additionalResponseOption: {
      textInputOption: false,
      textInputRequired: false,
    },
  },
}

export const radioItemMock: RadioItemDTO = {
  id: "radio-item-id",
  name: "radio item name",
  question: "Radio item mock question 3?",
  responseType: "singleSelect",
  responseValues: {
    options: [
      {
        id: "mock-option-1",
        text: "Mock option 1",
        isHidden: false,
        image: null,
        score: null,
        tooltip: null,
        color: null,
      },
      {
        id: "mock-option-2",
        text: "Mock option 2",
        isHidden: false,
        image: null,
        score: null,
        tooltip: null,
        color: null,
      },
      {
        id: "mock-option-3",
        text: "Mock option 3",
        isHidden: false,
        image: null,
        score: null,
        tooltip: null,
        color: null,
      },
    ],
  },
  order: 3,
  config: {
    removeBackButton: false,
    skippableItem: false,
    randomizeOptions: false,
    timer: null,
    addScores: false,
    setAlerts: false,
    addTooltip: false,
    setPalette: false,
    additionalResponseOption: {
      textInputOption: false,
      textInputRequired: false,
    },
  },
}

export const sliderItemMock: SliderItemDTO = {
  id: "slider-item-id",
  name: "slider item name",
  question: "Slider item mock question 3?",
  responseType: "slider",
  order: 4,
  responseValues: {
    minValue: 0,
    minLabel: "0",
    minImage: "https://dummyimage.com/600x400/000/fff.png",
    maxValue: 5,
    maxLabel: "5",
    maxImage: "https://dummyimage.com/600x400/000/fff.png",
  },
  config: {
    addScores: false,
    setAlerts: false,
    showTickMarks: true,
    showTickLabels: true,
    continuousSlider: false,
    removeBackButton: false,
    skippableItem: false,
    timer: null,
    additionalResponseOption: {
      textInputOption: false,
      textInputRequired: false,
    },
  },
}

export const activityDetailsWithItemsMock: ActivityDTO = {
  id: "55ea4993-a7ba-4751-9e6c-fea04e9d53e5",
  guid: "activity-mock-guid",
  name: "Mock activity with all item types",
  description: "Mock activity description",
  splashScreen: "",
  image: "",
  showAllAtOnce: false,
  isSkippable: false,
  isReviewable: false,
  responseIsEditable: false,
  ordering: 0,
  items: [textItemMock, sliderItemMock, checkboxItemMock, radioItemMock],
}
