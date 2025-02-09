// libs
import type { Fiber, ReactRenderer } from 'sidakram-bippy';

export type ReactInternals = {
    disabledDepth: number;
    prevLog?: (...args: unknown[]) => void;
    prevInfo?: (...args: unknown[]) => void;
    prevWarn?: (...args: unknown[]) => void;
    prevError?: (...args: unknown[]) => void;
    prevGroup?: (...args: unknown[]) => void;
    prevGroupCollapsed?: (...args: unknown[]) => void;
    prevGroupEnd?: (...args: unknown[]) => void;
    reentry: boolean;
    __DEV__: boolean;
    workTagMap: Record<string, number>;
    disabledLog: VoidFunction;
    disableLogs: VoidFunction;
    reenableLogs: VoidFunction;
    getDispatcherRef: (
        renderer: IReactRendererExtended,
    ) => CurrentDispatcherRef | undefined;
    describeFiber: (
        fiber: Fiber,
        dispatcherRef?: CurrentDispatcherRef,
    ) => string | undefined;
    describeFunctionComponentFrame: (
        type: Fiber['type'],
        dispatcherRef?: CurrentDispatcherRef,
    ) => string | undefined;
    describeNativeComponentFrame: (
        type: Fiber['type'],
        construct: boolean,
        dispatcherRef?: CurrentDispatcherRef,
    ) => string | undefined;
    describeClassComponentFrame: (
        type: Fiber['type'],
        dispatcherRef?: CurrentDispatcherRef,
    ) => string | undefined;
};

export type LegacyDispatcherRef = {
    current: unknown;
    H: undefined;
};

export type CurrentDispatcherRef = {
    H: unknown;
    current: undefined;
};

export type IReactRendererExtended = ReactRenderer & {
    currentDispatcherRef: CurrentDispatcherRef & LegacyDispatcherRef;
};

export type RenderPhaseType = 'mount' | 'update' | 'unmount';

export type Render = {
    phase: RenderPhaseType;
    componentName: string | null;
    fileName: string | null;
    count: number;
    time: number;
    reference?: string;
    uid: string;
};

export type RenderCoverageHash = {
    // here number represents a phase as defined in RenderPhase
    [K in number]?: Render;
};

export type RenderCovConfig = {
    /**
     * Enable or disable logging
     * @default development
     */
    mode?: 'development' | 'production';

    /**
     * Path of component to be ignored
     * @Note: - if both exclude and include are provided, include will be ignored
     * @default []
     */
    excludePath?: RegExp | string | (string | null)[];

    /**
     * Path of component to be included
     * @Note: If both exclude and include are provided, include will be ignored
     * @default undefined
     */
    includePath?: RegExp | string | (string | null)[];

    /**
     * If Path of the components could not be resolved, ignore them ie do not record thier coverage
     * @default false
     */
    ignoreEmptyPaths?: boolean;

    /**
     * Component name to be ignored
     * @Note: - if both exclude and include are provided, include will be ignored
     * @default []
     */
    excludeComponent?: RegExp | string | (string | null)[];

    /**
     * Component name to be included
     * @Note: If both exclude and include are provided, include will be ignored
     * @default undefined
     */
    includeComponent?: RegExp | string | (string | null)[];

    /**
     * If name of the components could not be resolved or is falsy, ignore them ie do not record thier coverage
     * @default false
     */
    ignoreEmptyComponents?: boolean;
};
