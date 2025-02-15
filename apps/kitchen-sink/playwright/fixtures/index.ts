// libs
import { test } from '@playwright/test';
import { extendRenderCovTest } from 'react-rendercov/dist/playwright';

export const renderTest = extendRenderCovTest(test);
