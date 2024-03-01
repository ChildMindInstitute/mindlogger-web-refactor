import { useForgotPasswordTranslation } from '../lib/useForgotPasswordTranslation';
import { ForgotPasswordSchema, TForgotPasswordForm } from '../model/schemas';

import { useRecoveryPasswordMutation } from '~/entities/user';
import { BaseButton, BasicFormProvider, Container, DisplaySystemMessage, Input } from '~/shared/ui';
import { useCustomForm } from '~/shared/utils';

export const ForgotPasswordForm = () => {
  const { t } = useForgotPasswordTranslation();

  const form = useCustomForm({ defaultValues: { email: '' } }, ForgotPasswordSchema);

  const { handleSubmit, watch } = form;

  const { mutate: recoveryPassword, isLoading, isSuccess, error } = useRecoveryPasswordMutation();

  const onForgotPasswordSubmit = (data: TForgotPasswordForm) => {
    recoveryPassword(data);
  };

  return (
    <BasicFormProvider {...form} onSubmit={handleSubmit(onForgotPasswordSubmit)}>
      <Container sx={{ marginBottom: '12px' }}>
        <p>{t('formTitle')}</p>
      </Container>

      <Input
        id="forgot-password-form-email"
        type="text"
        name="email"
        placeholder={t('email') || ''}
        autoComplete="email"
      />

      <DisplaySystemMessage errorMessage={error?.evaluatedMessage} />

      <Container sx={{ marginTop: '12px' }}>
        {!isSuccess && (
          <BaseButton type="submit" variant="contained" text={t('button')} isLoading={isLoading} />
        )}

        {isSuccess && (
          <DisplaySystemMessage successMessage={t('successMessage', { email: watch('email') })} />
        )}
      </Container>
    </BasicFormProvider>
  );
};
