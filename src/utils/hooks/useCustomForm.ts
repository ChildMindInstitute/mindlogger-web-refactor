import { FieldValues, useForm, UseFormProps, UseFormReturn } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import type { AnyObjectSchema } from "yup"

interface HookProps {
  schema: AnyObjectSchema
}

export const useCustomForm = <TFieldValues extends FieldValues, TContext = any>(
  props: UseFormProps<TFieldValues>,
  { schema }: HookProps,
): UseFormReturn<TFieldValues, TContext> => {
  return useForm({
    ...props,
    resolver: yupResolver(schema),
  })
}
