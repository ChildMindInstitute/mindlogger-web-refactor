import { APIRequestContext, request } from '@playwright/test';
import {runtimeConfig} from "../../../config";

import type {
  LoginPayload,
  LoginSuccessResponse,
  SignupPayload,
} from '../../../../src/shared/api';

export class CuriousApi {

  protected apiContext: APIRequestContext

  /**
   *
   * @param apiContext a fully built context with authentication already applied
   */
  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext
  }

  async dispose() {
    await this.apiContext.dispose();
  }

}
