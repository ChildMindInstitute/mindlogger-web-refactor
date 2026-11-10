import { useForm, UseFormProps } from 'react-hook-form';
import { z } from 'zod';

import zodResolver from '../validation/zodResolver';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CustomZodSchema = z.ZodType<any, any>;

export const useCustomForm = <TSchema extends CustomZodSchema>(
  props: UseFormProps<z.infer<TSchema>>,
  schema: TSchema,
) => {
  return useForm({
    ...props,
    resolver: zodResolver(schema),
  });
};
