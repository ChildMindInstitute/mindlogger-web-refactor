import { toNestError, validateFieldsNatively } from '@hookform/resolvers';
import { appendErrors, FieldError, FieldErrors } from 'react-hook-form';
import { z } from 'zod';

import type { Resolver } from '../types';

export type ZodFieldError = FieldError & {
  params: Record<string, unknown>;
};

const parseErrorSchema = (zodErrors: z.ZodIssue[], validateAllFieldCriteria: boolean) => {
  const errors: Record<string, ZodFieldError> = {};

  for (; zodErrors.length; ) {
    const error = zodErrors[0];
    const {
      code,
      message,
      path,
      params: customParams = {},
      ...otherParams
    } = error as z.ZodIssue & { params?: Record<string, unknown> };
    const params = { ...customParams, ...otherParams };
    const _path = path.join('.');

    if (!errors[_path]) {
      if (error.code === 'invalid_union' && error.errors[0]?.[0]) {
        const unionError = error.errors[0][0];

        errors[_path] = {
          message: unionError.message,
          type: unionError.code,
          params,
        };
      } else {
        errors[_path] = { message, type: code, params };
      }
    }

    if (error.code === 'invalid_union') {
      error.errors.forEach((unionErrors) => unionErrors.forEach((e) => zodErrors.push(e)));
    }

    if (validateAllFieldCriteria) {
      const types = errors[_path].types;
      const messages = types && types[error.code];

      errors[_path] = appendErrors(
        _path,
        validateAllFieldCriteria,
        errors,
        code,
        messages
          ? ([] as string[]).concat(messages as unknown as string[], error.message)
          : error.message,
      ) as ZodFieldError;
    }

    zodErrors.shift();
  }

  return errors;
};

const zodResolver: Resolver = (schema, schemaOptions, resolverOptions = {}) => {
  return async (values, _, options) => {
    try {
      const data = await schema[resolverOptions.mode === 'sync' ? 'parse' : 'parseAsync'](
        values,
        schemaOptions,
      );

      if (options.shouldUseNativeValidation) {
        validateFieldsNatively({}, options);
      }

      return {
        errors: {} as FieldErrors,
        values: resolverOptions.rawValues ? values : data,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.isEmpty) {
        return {
          values: {},
          errors: {},
        };
      } else {
        return {
          values: {},
          errors: toNestError(
            parseErrorSchema(
              error?.issues as z.ZodIssue[],
              !options.shouldUseNativeValidation && options.criteriaMode === 'all',
            ),
            options,
          ),
        };
      }
    }
  };
};

export default zodResolver;
