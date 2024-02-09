import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { useForgotPasswordTranslation } from '../lib/useForgotPasswordTranslation';
import { ForgotPasswordSchema, TForgotPasswordForm } from '../model/schemas';

import { useRecoveryPasswordMutation } from '~/entities/user';
import { Theme } from '~/shared/constants';
import { BasicFormProvider, Container, DisplaySystemMessage, Input } from '~/shared/ui';
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
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{ borderRadius: '100px', maxWidth: '400px', width: '100%', padding: '10px 24px' }}
          >
            {isLoading ? (
              <CircularProgress size={25} sx={{ color: Theme.colors.light.onPrimary }} />
            ) : (
              <Typography
                fontFamily="Atkinson"
                fontSize="16px"
                fontWeight={700}
                fontStyle="normal"
                lineHeight="20px"
                letterSpacing="0.1px"
                textTransform="none"
              >
                {t('button')}
              </Typography>
            )}
          </Button>
        )}

        {isSuccess && <DisplaySystemMessage successMessage={t('successMessage', { email: watch('email') })} />}
      </Container>
    </BasicFormProvider>
  );
};
