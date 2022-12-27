import { useForm, UseFormProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

export const useCustomForm = <TSchema extends z.AnyZodObject>(
  props: UseFormProps<z.infer<TSchema>>,
  schema: TSchema,
) => {
  return useForm({
    ...props,
    resolver: zodResolver(schema),
  })
}
