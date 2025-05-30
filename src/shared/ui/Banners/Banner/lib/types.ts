import { AlertProps } from '@mui/material';

export type BannerProps = {
  /**
   * Duration in milliseconds after which the banner will be automatically closed.
   * Provide `null` to disable auto-closing.
   * @default 5000
   */
  duration?: number | null;
  /** @default !!onClose */
  hasCloseButton?: boolean;
  onClose?: () => void;
} & Pick<AlertProps, 'severity' | 'children' | 'icon'> &
  Record<string, unknown>; // Custom banner props
