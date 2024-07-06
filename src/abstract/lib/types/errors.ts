import { AxiosError } from 'axios';

export type BackendError = {
  message: string;
  path: string[];
  type: string;
};

export type ApiError = AxiosError<{ result: BackendError }, unknown>;
