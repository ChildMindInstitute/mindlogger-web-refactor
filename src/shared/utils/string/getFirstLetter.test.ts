import { getFirstLetters } from "./getFirstLetter"

it("Should return the first letter of a string", () => {
  expect(getFirstLetters("John")).toBe("J")
  expect(getFirstLetters("John Doe")).toBe("JD")
  expect(getFirstLetters("John Doe", 1)).toBe("J")
  expect(getFirstLetters("John Doe", 2)).toBe("JD")
  expect(getFirstLetters("John Doe", 3)).toBe("JD")
  expect(getFirstLetters("John Doe", 4)).toBe("JD")
})
