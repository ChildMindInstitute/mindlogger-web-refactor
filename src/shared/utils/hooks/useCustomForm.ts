import { useForm, UseFormProps } from 'react-hook-form';
import { z } from 'zod';

import zodResolver from '../validation/zodResolver';

type CustomZodSchema = z.ZodTypeAny;

export const useCustomForm = <TSchema extends CustomZodSchema>(
  props: UseFormProps<z.infer<TSchema>>,
  schema: TSchema,
) => {
  return useForm({
    ...props,
    resolver: zodResolver(schema),
  });
};
