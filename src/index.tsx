import * as React from 'react';
import { Change, getChanges } from './utils';

function usePrevious<T>(value: T) {
  const ref = React.useRef<T | undefined>();

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

type Logger<T> = (item: Change<T> | string) => void;

export function useLogChanges<T>(
  value: T,
  label?: string,
  logger: Logger<T> = console.log
) {
  const previousValue = usePrevious<T>(value);
  const changes = getChanges<T>(previousValue, value);

  if (label && changes.length) {
    logger(label);
  }

  changes.forEach(change => {
    logger(change);
  });
}

export function useEffectDebugger(
  effect: React.EffectCallback,
  dependencies: React.DependencyList | undefined,
  label?: string
) {
  useLogChanges(dependencies, label);
  React.useEffect(effect, dependencies);
}

export function useLayoutEffectDebugger(
  effect: React.EffectCallback,
  dependencies: React.DependencyList | undefined,
  label?: string
) {
  useLogChanges(dependencies, label);
  React.useLayoutEffect(effect, dependencies);
}

export function useCallbackDebugger(
  callback: any,
  dependencies: React.DependencyList,
  label?: string
) {
  useLogChanges(dependencies, label);
  return React.useCallback(callback, dependencies);
}

export function useMemoDebugger(
  memoizer: () => unknown,
  dependencies: React.DependencyList | undefined,
  label?: string
) {
  useLogChanges(dependencies, label);
  return React.useMemo(memoizer, dependencies);
}
