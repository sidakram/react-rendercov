// libs
import { test } from "@playwright/test";
import { extendRenderCovTest } from "react-rendercov/playwright";

export const renderTest = extendRenderCovTest(test);
