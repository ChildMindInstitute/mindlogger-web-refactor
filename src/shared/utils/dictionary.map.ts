export const Dictionary = {
  validation: {
    email: {
      required: "validation.emailRequired",
      invalid: "validation.invalidEmail",
    },
    password: {
      required: "validation.passwordRequired",
      minLength: "validation.passwordMinLength",
      notMatch: "validation.passwordsUnmatched",
      shouldNotContainSpaces: "validation.passwordShouldNotContainSpaces",
    },
    firstName: {
      required: "validation.firstNameRequired",
    },
    lastName: {
      required: "validation.lastNameRequired",
    },
  },
}
