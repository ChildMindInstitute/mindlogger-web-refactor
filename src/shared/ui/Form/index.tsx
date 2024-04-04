import { BaseSyntheticEvent } from 'react';

import { FieldValues, FormProvider, FormProviderProps } from 'react-hook-form';

import { Any } from '../../utils';

interface BasicFormProviderProps {
  onSubmit: (e: BaseSyntheticEvent<object, Any, Any> | undefined) => void;
}

const BasicFormProvider = <TFieldValues extends FieldValues>({
  children,
  onSubmit,
  ...rest
}: FormProviderProps<TFieldValues> & BasicFormProviderProps) => {
  return (
    <FormProvider {...rest}>
      <form onSubmit={onSubmit}>{children}</form>
    </FormProvider>
  );
};

export default BasicFormProvider;
