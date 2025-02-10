// libs
import {
    createFiberVisitor,
    getDisplayName,
    getTimings,
    getType,
    installRDTHook,
    instrument,
    isCompositeFiber,
} from 'sidakram-bippy/dist/index';

import {
    extractFileName,
    getDispatcherRef,
    isWhitelistedComponent,
    isWhitelistedPath,
    updateRenderCount,
} from './helpers';
// helpers
import { $$__REACT_INTERNALS__ } from './internals';

// defs
import type { Render, RenderCovConfig, RenderCoverageHash } from './types';

// constants
let __DEV__ = false;
let __INIT__ = false;
let config: RenderCovConfig;

function initCountScanner(coverageHash: Map<string, RenderCoverageHash>) {
    const visitor = createFiberVisitor({
        onRender(fiber, phase) {
            const type = getType(fiber.type);
            if (!type) return;

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
                dispatcherRef,
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
                uid: `${exactFileName}_${displayName}`,
            };

            updateRenderCount(coverageHash, render);
        },
        onError: function onError() {
            return void 0;
        },
    });

    instrument({
        name: 'bippy-render-cov-playwright',
        onCommitFiberRoot(rendererID, root) {
            visitor(rendererID, root);
        },
    });
}

function instrumentRenderCov() {
    const coverageHash = new Map<string, RenderCoverageHash>();
    window.__RENDER_COVERAGE__ = coverageHash;
    installRDTHook();
    setTimeout(() => initCountScanner(coverageHash), 0);
    __DEV__ && console.log('log.render cov instrumentation installed');
}

export function initRenderCovPlaywright(_config: RenderCovConfig = {}) {
    if (typeof window !== 'undefined') {
        return;
    }

    if (__INIT__ === true) {
        __DEV__ && console.log('log.render cov already initialized');
        return;
    }

    if (typeof _config === 'object') {
        __INIT__ = true;
        __DEV__ = _config.mode === 'development';
        config = _config;
    }

    // Initialize React Render Coverage
    instrumentRenderCov();
}
