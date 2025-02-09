// defs
import type { CurrentDispatcherRef, ReactInternals } from './types';

/**
 *********************************************************************
 * These are internal react functions copied from react library itself
 * https://github.com/facebook/react/blob/main/packages/react-devtools-shared/src/backend/shared/DevToolsComponentStackFrame.js
 *
 * Its purpose is for finding file name and component references only
 * TODO: check later if there is any other easy way
 *********************************************************************
 */
export const $$__REACT_INTERNALS__: ReactInternals = {
    disabledDepth: 0,
    prevLog: undefined,
    prevInfo: undefined,
    prevWarn: undefined,
    prevError: undefined,
    prevGroup: undefined,
    prevGroupCollapsed: undefined,
    prevGroupEnd: undefined,
    reentry: false,
    __DEV__: false,
    workTagMap: {
        ClassComponent: 1,
        ContextProvider: 10,
        ForwardRef: 11,
        Fragment: 7,
        FunctionComponent: 0,
        LazyComponent: 16,
        MemoComponent: 14,
        SimpleMemoComponent: 15,
        IndeterminateComponent: 2,
    },
    disabledLog: function disabledLog() {
        return void 0;
    },
    disableLogs: function disableLogs() {
        if ($$__REACT_INTERNALS__.disabledDepth === 0) {
            $$__REACT_INTERNALS__.prevLog = console.log;
            $$__REACT_INTERNALS__.prevInfo = console.info;
            $$__REACT_INTERNALS__.prevWarn = console.warn;
            $$__REACT_INTERNALS__.prevError = console.error;
            $$__REACT_INTERNALS__.prevGroup = console.group;
            $$__REACT_INTERNALS__.prevGroupCollapsed = console.groupCollapsed;
            $$__REACT_INTERNALS__.prevGroupEnd = console.groupEnd;
            // https://github.com/facebook/react/issues/19099
            const props = {
                configurable: true,
                enumerable: true,
                value: $$__REACT_INTERNALS__.disabledLog,
                writable: true,
            };
            // $FlowFixMe[cannot-write] Flow thinks console is immutable.
            Object.defineProperties(console, {
                info: props,
                log: props,
                warn: props,
                error: props,
                group: props,
                groupCollapsed: props,
                groupEnd: props,
            });
        }
        $$__REACT_INTERNALS__.disabledDepth++;
    },
    reenableLogs: function reenableLogs() {
        $$__REACT_INTERNALS__.disabledDepth--;
        if ($$__REACT_INTERNALS__.disabledDepth === 0) {
            const props = {
                configurable: true,
                enumerable: true,
                writable: true,
            };
            // $FlowFixMe[cannot-write] Flow thinks console is immutable.
            Object.defineProperties(console, {
                log: { ...props, value: $$__REACT_INTERNALS__.prevLog },
                info: { ...props, value: $$__REACT_INTERNALS__.prevInfo },
                warn: { ...props, value: $$__REACT_INTERNALS__.prevWarn },
                error: { ...props, value: $$__REACT_INTERNALS__.prevError },
                group: { ...props, value: $$__REACT_INTERNALS__.prevGroup },
                groupCollapsed: {
                    ...props,
                    value: $$__REACT_INTERNALS__.prevGroupCollapsed,
                },
                groupEnd: {
                    ...props,
                    value: $$__REACT_INTERNALS__.prevGroupEnd,
                },
            });
        }
        if ($$__REACT_INTERNALS__.disabledDepth < 0) {
            $$__REACT_INTERNALS__.__DEV__ &&
                console.error(
                    'disabledDepth fell below zero. ' +
                        'This is a bug in React. Please file an issue.',
                );
        }
    },
    getDispatcherRef: function getDispatcherRef(renderer) {
        if (renderer.currentDispatcherRef === undefined) {
            return undefined;
        }

        const injectedRef = renderer.currentDispatcherRef;
        if (
            typeof injectedRef.H === 'undefined' &&
            typeof injectedRef.current !== 'undefined'
        ) {
            // We got a legacy dispatcher injected, let's create a wrapper proxy to translate.
            return {
                get H() {
                    return injectedRef.current;
                },
                set H(value) {
                    injectedRef.current = value;
                },
            } as CurrentDispatcherRef;
        }

        return injectedRef;
    },
    describeFiber: function describeFiber(
        workInProgress,
        currentDispatcherRef,
    ) {
        const {
            FunctionComponent,
            IndeterminateComponent,
            SimpleMemoComponent,
            ForwardRef,
            ClassComponent,
        } = $$__REACT_INTERNALS__.workTagMap;

        switch (workInProgress.tag) {
            case FunctionComponent:
            case IndeterminateComponent:
            case SimpleMemoComponent:
                return $$__REACT_INTERNALS__.describeFunctionComponentFrame(
                    workInProgress.type,
                    currentDispatcherRef,
                );
            case ForwardRef:
                return $$__REACT_INTERNALS__.describeFunctionComponentFrame(
                    workInProgress.type.render,
                    currentDispatcherRef,
                );
            case ClassComponent:
                return $$__REACT_INTERNALS__.describeClassComponentFrame(
                    workInProgress.type,
                    currentDispatcherRef,
                );
            default:
                return '';
        }
    },
    describeClassComponentFrame: function describeClassComponentFrame(
        ctor,
        currentDispatcherRef,
    ) {
        return $$__REACT_INTERNALS__.describeNativeComponentFrame(
            ctor,
            true,
            currentDispatcherRef,
        );
    },
    describeFunctionComponentFrame: function describeFunctionComponentFrame(
        fn,
        currentDispatcherRef,
    ) {
        return $$__REACT_INTERNALS__.describeNativeComponentFrame(
            fn,
            false,
            currentDispatcherRef,
        );
    },
    describeNativeComponentFrame: function describeNativeComponentFrame(
        fn,
        construct,
        currentDispatcherRef,
    ) {
        const previousPrepareStackTrace = Error.prepareStackTrace;
        // $FlowFixMe[incompatible-type] It does accept undefined.
        Error.prepareStackTrace = undefined;

        $$__REACT_INTERNALS__.reentry = true;

        // Override the dispatcher so effects scheduled by this shallow render are thrown away.
        //
        // Note that unlike the code this was forked from (in ReactComponentStackFrame)
        // DevTools should override the dispatcher even when DevTools is compiled in production mode,
        // because the app itself may be in development mode and log errors/warnings.
        const previousDispatcher = currentDispatcherRef?.H;
        if (currentDispatcherRef) {
            currentDispatcherRef.H = null;
        }
        $$__REACT_INTERNALS__.disableLogs();

        try {
            const RunInRootFrame = {
                DetermineComponentFrameRoot() {
                    let control: unknown;
                    try {
                        // This should throw.
                        if (construct) {
                            const Fake = () => {
                                throw Error();
                            };
                            Object.defineProperty(Fake.prototype, 'props', {
                                set: () => {
                                    // We use a throwing setter instead of frozen or non-writable props
                                    // because that won't throw in a non-strict mode function.
                                    throw Error();
                                },
                                get: () => {
                                    throw Error();
                                },
                            });
                            if (
                                typeof Reflect === 'object' &&
                                Reflect.construct
                            ) {
                                // We construct a different control for this case to include any extra
                                // frames added by the construct call.
                                try {
                                    Reflect.construct(Fake, []);
                                } catch (x) {
                                    control = x;
                                }
                                Reflect.construct(fn, [], Fake);
                            } else {
                                try {
                                    // @ts-expect-error
                                    Fake.call();
                                } catch (x) {
                                    control = x;
                                }
                                // $FlowFixMe[prop-missing] found when upgrading Flow
                                fn.call(Fake.prototype);
                            }
                        } else {
                            try {
                                throw Error();
                            } catch (x) {
                                control = x;
                            }
                            // TODO(luna): This will currently only throw if the function component
                            // tries to access React/ReactDOM/props. We should probably make this throw
                            // in simple components too
                            const maybePromise = fn();

                            // If the function component returns a promise, it's likely an async
                            // component, which we don't yet support. Attach a noop catch handler to
                            // silence the error.
                            // TODO: Implement component stacks for async client components?
                            if (
                                maybePromise &&
                                typeof maybePromise.catch === 'function'
                            ) {
                                maybePromise.catch(() => void 0);
                            }
                        }
                    } catch (sample) {
                        // This is inlined manually because closure doesn't do it for us.
                        if (
                            sample &&
                            control &&
                            typeof (sample as Error).stack === 'string'
                        ) {
                            return [
                                (sample as Error).stack,
                                (control as Error).stack,
                            ];
                        }
                    }
                    return [null, null];
                },
            };
            // @ts-expect-error
            RunInRootFrame.DetermineComponentFrameRoot.displayName =
                'DetermineComponentFrameRoot';
            const namePropDescriptor = Object.getOwnPropertyDescriptor(
                RunInRootFrame.DetermineComponentFrameRoot,
                'name',
            );
            // Before ES6, the `name` property was not configurable.
            if (namePropDescriptor?.configurable) {
                // V8 utilizes a function's `name` property when generating a stack trace.
                Object.defineProperty(
                    RunInRootFrame.DetermineComponentFrameRoot,
                    // Configurable properties can be updated even if its writable descriptor
                    // is set to `false`.
                    // $FlowFixMe[cannot-write]
                    'name',
                    { value: 'DetermineComponentFrameRoot' },
                );
            }

            const [sampleStack, controlStack] =
                RunInRootFrame.DetermineComponentFrameRoot();

            if (sampleStack && controlStack) {
                // This extracts the first frame from the sample that isn't also in the control.
                // Skipping one frame that we assume is the frame that calls the two.
                const sampleLines = sampleStack.split('\n');
                const controlLines = controlStack.split('\n');
                let s = 0;
                let c = 0;
                while (
                    s < sampleLines.length &&
                    !sampleLines[s].includes('DetermineComponentFrameRoot')
                ) {
                    s++;
                }
                while (
                    c < controlLines.length &&
                    !controlLines[c].includes('DetermineComponentFrameRoot')
                ) {
                    c++;
                }
                // We couldn't find our intentionally injected common root frame, attempt
                // to find another common root frame by search from the bottom of the
                // control stack...
                if (s === sampleLines.length || c === controlLines.length) {
                    s = sampleLines.length - 1;
                    c = controlLines.length - 1;
                    while (
                        s >= 1 &&
                        c >= 0 &&
                        sampleLines[s] !== controlLines[c]
                    ) {
                        // We expect at least one stack frame to be shared.
                        // Typically this will be the root most one. However, stack frames may be
                        // cut off due to maximum stack limits. In this case, one maybe cut off
                        // earlier than the other. We assume that the sample is longer or the same
                        // and there for cut off earlier. So we should find the root most frame in
                        // the sample somewhere in the control.
                        c--;
                    }
                }
                for (; s >= 1 && c >= 0; s--, c--) {
                    // Next we find the first one that isn't the same which should be the
                    // frame that called our sample function and the control.
                    if (sampleLines[s] !== controlLines[c]) {
                        // In V8, the first line is describing the message but other VMs don't.
                        // If we're about to return the first line, and the control is also on the same
                        // line, that's a pretty good indicator that our sample threw at same line as
                        // the control. I.e. before we entered the sample frame. So we ignore this result.
                        // This can happen if you passed a class to function component, or non-function.
                        if (s !== 1 || c !== 1) {
                            do {
                                s--;
                                c--;
                                // We may still have similar intermediate frames from the construct call.
                                // The next one that isn't the same should be our match though.
                                if (
                                    c < 0 ||
                                    sampleLines[s] !== controlLines[c]
                                ) {
                                    // V8 adds a "new" prefix for native classes. Let's remove it to make it prettier.
                                    let frame = `\n${sampleLines[s].replace(' at new ', ' at ')}`;

                                    // If our component frame is labeled "<anonymous>"
                                    // but we have a user-provided "displayName"
                                    // splice it in to make the stack more readable.
                                    if (
                                        fn.displayName &&
                                        frame.includes('<anonymous>')
                                    ) {
                                        frame = frame.replace(
                                            '<anonymous>',
                                            fn.displayName,
                                        );
                                    }

                                    // if (__DEV__) {
                                    //     if (typeof fn === 'function') {
                                    //         componentFrameCache.set(fn, frame);
                                    //     }
                                    // }
                                    // Return the line we found.
                                    return frame;
                                }
                            } while (s >= 1 && c >= 0);
                        }
                        break;
                    }
                }
            }
        } finally {
            $$__REACT_INTERNALS__.reentry = false;
            Error.prepareStackTrace = previousPrepareStackTrace;
            if (currentDispatcherRef) {
                currentDispatcherRef.H = previousDispatcher;
            }
            $$__REACT_INTERNALS__.reenableLogs();
        }
    },
};
