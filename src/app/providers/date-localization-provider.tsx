import { PropsWithChildren } from 'react';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

type Props = PropsWithChildren<unknown>;

function DateLocalizationProvider({ children }: Props) {
  return <LocalizationProvider dateAdapter={AdapterDateFns}>{children}</LocalizationProvider>;
}

export default DateLocalizationProvider;
