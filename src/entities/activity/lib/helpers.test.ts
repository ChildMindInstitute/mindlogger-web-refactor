import { hasAdditionalResponse, requiresAdditionalResponse, supportsAdditionalResponseField } from "./helpers"

describe("Activity helpers", () => {
  describe("supportsAdditionalResponseField", () => {
    it("Text item should return false", () => {
      expect(supportsAdditionalResponseField({ responseType: "text" })).toEqual(false)
    })

    it("Splash screen item should return false", () => {
      expect(supportsAdditionalResponseField({ responseType: "splashScreen" })).toEqual(false)
    })

    it("Message item should return false", () => {
      expect(supportsAdditionalResponseField({ responseType: "message" })).toEqual(false)
    })

    it("Checkbox item should return true", () => {
      expect(supportsAdditionalResponseField({ responseType: "multiSelect" })).toEqual(true)
    })

    it("Radio item should return true", () => {
      expect(supportsAdditionalResponseField({ responseType: "singleSelect" })).toEqual(true)
    })

    it("Slider item should return true", () => {
      expect(supportsAdditionalResponseField({ responseType: "slider" })).toEqual(true)
    })

    it("Date item should return true", () => {
      expect(supportsAdditionalResponseField({ responseType: "date" })).toEqual(true)
    })

    it("Number select item should return true", () => {
      expect(supportsAdditionalResponseField({ responseType: "numberSelect" })).toEqual(true)
    })

    it("Time item should return true", () => {
      expect(supportsAdditionalResponseField({ responseType: "time" })).toEqual(true)
    })

    it("Time range item should return true", () => {
      expect(supportsAdditionalResponseField({ responseType: "timeRange" })).toEqual(true)
    })

    it("Audio player item should return true", () => {
      expect(supportsAdditionalResponseField({ responseType: "audioPlayer" })).toEqual(true)
    })
  })

  describe("hasAdditionalResponse", () => {
    it("Unsupported item should return false", () => {
      expect(
        hasAdditionalResponse({
          responseType: "text",
          config: {
            removeBackButton: false,
            skippableItem: false,
            maxResponseLength: 300,
            correctAnswerRequired: false,
            correctAnswer: "",
            numericalResponseRequired: false,
            responseDataIdentifier: false,
            responseRequired: false,
          },
        }),
      ).toEqual(false)
    })

    it("Supported item with additional response option disabled should return false", () => {
      expect(
        hasAdditionalResponse({
          responseType: "singleSelect",
          config: {
            removeBackButton: false,
            skippableItem: false,
            timer: null,
            randomizeOptions: false,
            addScores: false,
            setAlerts: false,
            addTooltip: false,
            setPalette: false,
            autoAdvance: false,
            additionalResponseOption: {
              textInputOption: false,
              textInputRequired: false,
            },
          },
        }),
      ).toEqual(false)
    })

    it("Supported item with additional response option enabled should return true", () => {
      expect(
        hasAdditionalResponse({
          responseType: "singleSelect",
          config: {
            removeBackButton: false,
            skippableItem: false,
            timer: null,
            randomizeOptions: false,
            addScores: false,
            setAlerts: false,
            addTooltip: false,
            setPalette: false,
            autoAdvance: false,
            additionalResponseOption: {
              textInputOption: true,
              textInputRequired: false,
            },
          },
        }),
      ).toEqual(true)
    })
  })

  describe("requiresAdditionalResponse", () => {
    it("Unsupported item should return false", () => {
      expect(
        requiresAdditionalResponse({
          responseType: "text",
          config: {
            removeBackButton: false,
            skippableItem: false,
            maxResponseLength: 300,
            correctAnswerRequired: false,
            correctAnswer: "",
            numericalResponseRequired: false,
            responseDataIdentifier: false,
            responseRequired: false,
          },
        }),
      ).toEqual(false)
    })

    it("Supported item with optional additional response should return false", () => {
      expect(
        requiresAdditionalResponse({
          responseType: "singleSelect",
          config: {
            removeBackButton: false,
            skippableItem: false,
            timer: null,
            randomizeOptions: false,
            addScores: false,
            setAlerts: false,
            addTooltip: false,
            setPalette: false,
            autoAdvance: false,
            additionalResponseOption: {
              textInputOption: true,
              textInputRequired: false,
            },
          },
        }),
      ).toEqual(false)
    })

    it("Supported item with required additional response should return true", () => {
      expect(
        requiresAdditionalResponse({
          responseType: "singleSelect",
          config: {
            removeBackButton: false,
            skippableItem: false,
            timer: null,
            randomizeOptions: false,
            addScores: false,
            setAlerts: false,
            addTooltip: false,
            setPalette: false,
            autoAdvance: false,
            additionalResponseOption: {
              textInputOption: true,
              textInputRequired: true,
            },
          },
        }),
      ).toEqual(true)
    })
  })
})
