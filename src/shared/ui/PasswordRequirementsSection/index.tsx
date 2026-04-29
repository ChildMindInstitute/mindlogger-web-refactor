import type { FocusEvent, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import { useFormContext, useWatch } from 'react-hook-form';

import {
  StyledSection,
  StyledSectionTitle,
  StyledGrid,
  StyledRequirement,
  PasswordRequirementsFieldGroup,
  PasswordRequirementsSectionState,
} from './PasswordRequirementsSection.styles';
import { usePasswordRequirementsChecklistDisplay } from './usePasswordRequirementsChecklistDisplay';

import { ACCOUNT_PASSWORD_MIN_CHAR_TYPES, ACCOUNT_PASSWORD_MIN_LENGTH } from '~/shared/constants';
import { useCustomTranslation } from '~/shared/utils';
import { isAccountPasswordPolicySatisfied } from '~/shared/utils/passwordValidation';

function getPasswordRequirementsSectionState(
  firstFocusWithin: boolean,
  isPasswordEmpty: boolean,
  policySatisfiedForDisplay: boolean,
): PasswordRequirementsSectionState {
  if (policySatisfiedForDisplay) {
    return PasswordRequirementsSectionState.MET;
  }
  if (firstFocusWithin || isPasswordEmpty) {
    return PasswordRequirementsSectionState.FOCUSED;
  }
  return PasswordRequirementsSectionState.ERROR;
}

const RequirementItem = ({ met, label }: { met: boolean; label: string }) => (
  <StyledRequirement
    met={met}
    data-testid={`password-req-${label.replaceAll(' ', '-').toLowerCase()}`}
  >
    {met ? <CheckIcon /> : <CloseIcon />} {label}
  </StyledRequirement>
);

interface PasswordRequirementsSectionProps {
  /**
   * If passed, wraps fields + checklist. The panel uses live policy; title / grid hide / “met” copy
   * follow a short debounce after `password` stops changing.
   */
  children?: ReactNode;
  delayMs: number;
  setShowPasswordError: (showPasswordError: boolean) => void;
  fieldName: string;
}

export const PasswordRequirementsSection = ({
  children,
  delayMs,
  setShowPasswordError,
  fieldName,
}: PasswordRequirementsSectionProps) => {
  // If focusWithin is true, the user is inside the component and the checklist should be visible.
  const [focusWithin, setFocusWithin] = useState(false);

  // Tracks if this is the first time the user has focused within the component.
  const [firstFocusWithin, setFirstFocusWithin] = useState(true);
  const firstFocusWithinRef = useRef(true);

  const { t } = useCustomTranslation({ keyPrefix: 'validation' });

  const {
    trigger,
    clearErrors,
    formState: { isSubmitting, isSubmitted },
  } = useFormContext();

  const passwordValue = useWatch({ name: fieldName });

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!passwordValue) {
        if (!isSubmitted) clearErrors(fieldName);
        return;
      }

      // We only want to show the input's error if the user has not typed anything yet, otherwise all errors are shown using the password requirements section
      setShowPasswordError(false);

      if (!firstFocusWithinRef.current) {
        await trigger(fieldName);
      }
    }, delayMs);

    return () => clearTimeout(timer);
  }, [passwordValue, trigger, clearErrors, isSubmitted]);

  useEffect(() => {
    if (isSubmitting && !passwordValue) {
      setShowPasswordError(true);
    }
  }, [isSubmitting, passwordValue, setShowPasswordError]);

  const {
    result,
    hideCharTypesGrid,
    displayPolicySatisfied,
    passwordRequirementsSectionTitleKey,
    isEmptyForDisplay,
  } = usePasswordRequirementsChecklistDisplay(passwordValue, delayMs);

  const checklist = (
    <div data-testid="password-requirements-section">
      <StyledSection>
        <StyledSectionTitle
          state={getPasswordRequirementsSectionState(
            firstFocusWithin,
            isEmptyForDisplay,
            displayPolicySatisfied,
          )}
        >
          {t(passwordRequirementsSectionTitleKey, {
            minLength: ACCOUNT_PASSWORD_MIN_LENGTH,
            types: ACCOUNT_PASSWORD_MIN_CHAR_TYPES,
          })}
        </StyledSectionTitle>
      </StyledSection>

      {!hideCharTypesGrid && (
        <StyledSection>
          <StyledGrid>
            <RequirementItem met={result.hasUppercase} label={t('passwordReqUppercase')} />
            <RequirementItem met={result.hasLowercase} label={t('passwordReqLowercase')} />
            <RequirementItem met={result.hasDigit} label={t('passwordReqNumbers')} />
            <RequirementItem met={result.hasSymbol} label={t('passwordReqSymbols')} />
          </StyledGrid>
        </StyledSection>
      )}
    </div>
  );

  if (children !== undefined) {
    // Open panel without focus if they typed something invalid (uses live rules, not debounced UI).
    const keepChecklistVisible = !isEmptyForDisplay && !isAccountPasswordPolicySatisfied(result);
    const showPasswordPanel = keepChecklistVisible || focusWithin;

    const handleBlurCapture = (e: FocusEvent<HTMLDivElement>) => {
      const next = e.relatedTarget as Node | null;
      if (next && e.currentTarget.contains(next)) return;
      setFocusWithin(false);

      // Set to false so the checklist shows error status when the user focuses back in.
      firstFocusWithinRef.current = false;
      setFirstFocusWithin(false);
    };

    return (
      <PasswordRequirementsFieldGroup
        data-testid="password-requirements-field-group"
        showPasswordPanel={showPasswordPanel}
        onFocusCapture={() => {
          setFocusWithin(true);
          setShowPasswordError(false);
        }}
        onBlurCapture={handleBlurCapture}
      >
        <Box display="flex" flexDirection="column" gap="24px">
          {children}
        </Box>
        <Box className="password-requirements-panel" data-testid="password-requirements-panel">
          {checklist}
        </Box>
      </PasswordRequirementsFieldGroup>
    );
  }

  return checklist;
};
