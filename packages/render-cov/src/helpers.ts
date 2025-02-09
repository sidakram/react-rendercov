// helpers
import { $$__REACT_INTERNALS__ } from './internals';

// defs
import type {
    IReactRendererExtended,
    Render,
    RenderCovConfig,
    RenderCoverageHash,
} from './types';

const RenderPhase = {
    Mount: 0b001,
    Update: 0b010,
    Unmount: 0b100,
};

const Regex = {
    FILE_NAME: /([^\s\/\?]+)\??(\:\d+\:\d+)/,
    SPACE_TAB: /[\n\s]+/,
    LINE_DIGITS: /\:\d+:\d+/,
};

const RENDER_PHASE_STRING_TO_ENUM = {
    mount: RenderPhase.Mount,
    update: RenderPhase.Update,
    unmount: RenderPhase.Unmount,
};

export function getDispatcherRef(rendererId = 1) {
    return $$__REACT_INTERNALS__.getDispatcherRef(
        __REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers.get(
            rendererId,
        ) as IReactRendererExtended,
    );
}

export function updateRenderCount(
    hash: Map<string, RenderCoverageHash>,
    render: Render,
) {
    const renderPhaseId = RENDER_PHASE_STRING_TO_ENUM[render.phase];
    const componentHash = hash.has(render.uid) && hash.get(render.uid);
    if (componentHash) {
        const renderPhaseHash = componentHash[renderPhaseId];
        if (renderPhaseHash) {
            renderPhaseHash.count += 1;
            renderPhaseHash.time += render.time;
            hash.set(render.uid, {
                [renderPhaseId]: renderPhaseHash,
                ...componentHash,
            });
        } else {
            hash.set(render.uid, {
                [renderPhaseId]: render,
                ...componentHash,
            });
        }
    } else {
        hash.set(render.uid, {
            [renderPhaseId]: render,
        });
    }
}

export function extractFileName(path?: string) {
    if (!path) return '';

    const possiblyFileNames = path
        .split(Regex.SPACE_TAB)
        .map((v) => v.trim())
        .filter((v) => !!v)
        .filter((v) => Regex.LINE_DIGITS.exec(v));
    const exactFileName =
        (Regex.FILE_NAME.exec(possiblyFileNames[0] ?? '') || [])[1] ?? 'NULL';

    return exactFileName;
}

export function isWhitelistedComponent(
    componentName: string | null,
    config: RenderCovConfig,
) {
    const { includeComponent, ignoreEmptyComponents, excludeComponent } =
        config;

    if (ignoreEmptyComponents && (!componentName || componentName === 'null')) {
        return false;
    }

    if (includeComponent) {
        if (Array.isArray(includeComponent) && includeComponent.length) {
            return includeComponent.includes(componentName);
        }

        if (typeof includeComponent === 'string' && includeComponent.length) {
            return (
                includeComponent.toLowerCase() ===
                componentName?.toLocaleLowerCase()
            );
        }

        if (includeComponent instanceof RegExp) {
            return includeComponent.test(componentName ?? '');
        }

        return true;
    }

    if (excludeComponent) {
        if (Array.isArray(excludeComponent) && excludeComponent.length) {
            return !excludeComponent.includes(componentName);
        }

        if (typeof excludeComponent === 'string' && excludeComponent.length) {
            return (
                excludeComponent.toLowerCase() !==
                componentName?.toLocaleLowerCase()
            );
        }

        if (excludeComponent instanceof RegExp) {
            return !excludeComponent.test(componentName ?? '');
        }

        return true;
    }

    return true;
}

export function isWhitelistedPath(
    fileName: string | null,
    config: RenderCovConfig,
) {
    const { includePath, ignoreEmptyPaths, excludePath } = config;

    if (ignoreEmptyPaths && (!fileName || fileName === 'null')) {
        return false;
    }

    if (includePath) {
        if (Array.isArray(includePath) && includePath.length) {
            return includePath.includes(fileName);
        }

        if (typeof includePath === 'string' && includePath.length) {
            return includePath.toLowerCase() === fileName?.toLocaleLowerCase();
        }

        if (includePath instanceof RegExp) {
            return includePath.test(fileName ?? '');
        }

        return true;
    }

    if (excludePath) {
        if (Array.isArray(excludePath) && excludePath.length) {
            return !excludePath.includes(fileName);
        }

        if (typeof excludePath === 'string' && excludePath.length) {
            return excludePath.toLowerCase() !== fileName?.toLocaleLowerCase();
        }

        if (excludePath instanceof RegExp) {
            return !excludePath.test(fileName ?? '');
        }

        return true;
    }

    return true;
}
