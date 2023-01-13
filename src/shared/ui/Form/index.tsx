import { BaseSyntheticEvent } from "react"

import { Container } from "react-bootstrap"
import { FieldValues, FormProvider, FormProviderProps } from "react-hook-form"

interface BasicFormProviderProps {
  onSubmit: (e: BaseSyntheticEvent<object, any, any> | undefined) => void
}

const BasicFormProvider = <TFieldValues extends FieldValues>({
  children,
  onSubmit,
  ...rest
}: FormProviderProps<TFieldValues> & BasicFormProviderProps) => {
  return (
    <FormProvider {...rest}>
      <form onSubmit={onSubmit}>
        <Container fluid className="mt-3 mb-2">
          {children}
        </Container>
      </form>
    </FormProvider>
  )
}

export default BasicFormProvider
