import { BaseSyntheticEvent } from 'react';

import { useForgotPasswordTranslation } from '../lib/useForgotPasswordTranslation';
import { ForgotPasswordSchema, TForgotPasswordForm } from '../model/schemas';

import { useRecoveryPasswordMutation } from '~/entities/user';
import { BaseButton, BasicFormProvider, Container, DisplaySystemMessage, Input } from '~/shared/ui';
import { useCustomForm } from '~/shared/utils';
import { useSessionElsewhereGuard } from '~/shared/utils/hooks/useSessionElsewhereGuard';

export const ForgotPasswordForm = () => {
  const { t } = useForgotPasswordTranslation();

  const form = useCustomForm({ defaultValues: { email: '' } }, ForgotPasswordSchema);

  const { handleSubmit, watch } = form;

  const { mutate: recoveryPassword, isLoading, isSuccess, error } = useRecoveryPasswordMutation();
  const { isBlocked, refuse } = useSessionElsewhereGuard();

  const onForgotPasswordSubmit = (data: TForgotPasswordForm) => {
    recoveryPassword(data);
  };

  const handleFormSubmit = (event?: BaseSyntheticEvent) => {
    // No session is started here, but a tab that is not in the live one does not act on its own.
    // Ahead of validation, so Enter on an empty field is turned away the same way a click is.
    if (refuse()) return event?.preventDefault();

    void handleSubmit(onForgotPasswordSubmit)(event);
  };

  return (
    <BasicFormProvider {...form} onSubmit={handleFormSubmit}>
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
          <BaseButton
            type="submit"
            variant="contained"
            text={t('button')}
            isLoading={isLoading}
            disabled={isBlocked}
          />
        )}

        {isSuccess && (
          <DisplaySystemMessage successMessage={t('successMessage', { email: watch('email') })} />
        )}
      </Container>
    </BasicFormProvider>
  );
};
