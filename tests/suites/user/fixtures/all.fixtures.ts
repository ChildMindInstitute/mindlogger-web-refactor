import {mergeTests} from "@playwright/test";
import {test as pagesTest} from "../../../fixtures/pages.fixture";
import {test as apiTest} from './api.fixtures'


export const test = mergeTests(pagesTest, apiTest);
export { expect } from '@playwright/test';
