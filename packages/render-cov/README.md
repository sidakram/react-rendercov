# `react-rendercov`

`react-rendercov` is a powerful utility designed to collect render counts during Playwright tests and output them as structured JSON data. It internally uses the [**Bippy**](https://github.com/aidenybai/bippy) package.

---

## Features

- **Seamless Integration with Playwright**: Easily integrates with your existing Playwright test suite to capture render counts.
- **JSON Output**: Outputs collected render data as structured JSON, which you can use for analysis.

---

## Installation

You can install `react-rendercov` via npm:

```bash
npm install react-rendercov --save-dev
```

## Usage

### Instrumentation
```js
import { initRenderCovPlaywright } from "react-rendercov";
initRenderCovPlaywright();
```

**IMPORTANT** - Initialize this before importing react in your codebase root/index file.

### Tests
```js
import { renderCovTest as test } from "react-rendercov/playwright";

renderCovTest('test render collection', async ({ page }) => {
  ...
});

```