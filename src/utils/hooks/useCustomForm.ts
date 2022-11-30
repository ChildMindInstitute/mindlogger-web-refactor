import { FieldValues, useForm, UseFormProps } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import type { AnyObjectSchema } from "yup"

interface HookProps {
  schema: AnyObjectSchema
}

export const useCustomForm = <TFieldValues extends FieldValues>(
  props: UseFormProps<TFieldValues>,
  { schema }: HookProps,
) => {
  return useForm({
    ...props,
    resolver: yupResolver(schema),
  })
}
