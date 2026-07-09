// libs
import {
  traverseRenderedFibers,
  getDisplayName,
  getTimings,
  getType,
  installRDTHook,
  instrument,
  isCompositeFiber,
  Fiber,
} from "bippy";

import {
  extractFileName,
  getDispatcherRef,
  isWhitelistedComponent,
  isWhitelistedPath,
  updateRenderCount,
} from "./helpers";
// helpers
import { $$__REACT_INTERNALS__ } from "./internals";

// defs
import type { Render, RenderCovConfig, RenderCoverageHash } from "./types";

// constants
let __DEV__ = false;
let __INIT__ = false;
let config: RenderCovConfig;

function initCountScanner(coverageHash: Map<string, RenderCoverageHash>) {
  instrument({
    name: "bippy-render-cov-playwright",
    onCommitFiberRoot(_rendererID, root) {
      traverseRenderedFibers(
        root.current,
        (fiber: Fiber, phase: "mount" | "update" | "unmount") => {
          const type = getType(fiber.type);
          if (!type) return;

          // @ts-expect-error - renderCovName is injected manually at function definition level
          const renderCovComponentName: string | undefined = type.renderCovName;

          if (
            !config.disableCustomNamesCheck &&
            typeof renderCovComponentName === "undefined"
          ) {
            return;
          }

          if (!isCompositeFiber(fiber)) {
            return;
          }

          const { selfTime } = getTimings(fiber);
          const displayName = getDisplayName(type);

          if (!isWhitelistedComponent(displayName, config)) {
            return;
          }

          const dispatcherRef = getDispatcherRef();
          const reference = $$__REACT_INTERNALS__.describeFiber(
            fiber,
            dispatcherRef
          );
          const exactFileName = extractFileName(reference);

          if (!isWhitelistedPath(exactFileName, config)) {
            return;
          }

          const render: Render = {
            phase,
            componentName: displayName,
            count: 1,
            time: selfTime,
            reference,
            fileName: exactFileName,
            uid: renderCovComponentName ?? `${exactFileName}_${displayName}`,
          };

          updateRenderCount(coverageHash, render);
        }
      );
    },
  });
}

function instrumentRenderCov() {
  const coverageHash = new Map<string, RenderCoverageHash>();
  window.__RENDER_COVERAGE__ = coverageHash;
  installRDTHook();
  setTimeout(() => initCountScanner(coverageHash), 0);
  __DEV__ && console.log("log.render cov instrumentation installed");
}

export function initRenderCovPlaywright(_config: RenderCovConfig = {}) {
  if (typeof window === "undefined") {
    return;
  }

  if (__INIT__ === true) {
    __DEV__ && console.log("log.render cov already initialized");
    return;
  }

  if (typeof _config === "object") {
    __INIT__ = true;
    __DEV__ = _config.mode === "development";
    config = _config;
  }

  // Initialize React Render Coverage
  instrumentRenderCov();
}

export default {
  initRenderCovPlaywright,
};
