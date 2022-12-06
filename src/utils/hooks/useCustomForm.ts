import { FieldValues, useForm, UseFormProps, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { ZodSchema } from "zod"

interface HookProps {
  schema: ZodSchema
}

export const useCustomForm = <TFieldValues extends FieldValues, TContext = any>(
  props: UseFormProps<TFieldValues>,
  { schema }: HookProps,
): UseFormReturn<TFieldValues, TContext> => {
  return useForm({
    ...props,
    resolver: zodResolver(schema),
  })
}
