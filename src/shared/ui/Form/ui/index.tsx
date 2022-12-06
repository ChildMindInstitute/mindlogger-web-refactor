import { Container } from "react-bootstrap"
import { FieldValues, FormProvider, FormProviderProps } from "react-hook-form"

const BasicFormProvider = <TFieldValues extends FieldValues>({
  children,
  ...rest
}: FormProviderProps<TFieldValues>) => {
  return (
    <FormProvider {...rest}>
      <Container fluid className="my-3">
        {children}
      </Container>
    </FormProvider>
  )
}

export default BasicFormProvider
