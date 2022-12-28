import { useForm, UseFormProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

type CustomZodSchema = z.Schema

export const useCustomForm = <TSchema extends CustomZodSchema>(
  props: UseFormProps<z.infer<TSchema>>,
  schema: TSchema,
) => {
  return useForm({
    ...props,
    resolver: zodResolver(schema),
  })
}
