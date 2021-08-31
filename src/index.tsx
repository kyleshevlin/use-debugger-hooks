import * as React from 'react';
import { getChanges } from './utils';

function usePrevious<T>(value: T) {
  const ref = React.useRef<T | undefined>();

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export function useLogChanges<T>(value: T, logger = console.log) {
  const previousValue = usePrevious<T>(value);
  const changes = getChanges<T>(previousValue, value);

  changes.forEach(change => {
    logger(change);
  });
}

export function useEffectDebugger(
  effect: React.EffectCallback,
  dependencies: React.DependencyList | undefined
) {
  useLogChanges(dependencies);
  React.useEffect(effect, dependencies);
}

export function useLayoutEffectDebugger(
  effect: React.EffectCallback,
  dependencies: React.DependencyList | undefined
) {
  useLogChanges(dependencies);
  React.useLayoutEffect(effect, dependencies);
}

export function useCallbackDebugger(
  callback: any,
  dependencies: React.DependencyList
) {
  useLogChanges(dependencies);
  return React.useCallback(callback, dependencies);
}

export function useMemoDebugger(
  memoizer: () => unknown,
  dependencies: React.DependencyList | undefined
) {
  useLogChanges(dependencies);
  return React.useMemo(memoizer, dependencies);
}
