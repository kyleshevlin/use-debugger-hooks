import * as React from 'react';

function usePrevious<T>(value: T) {
  const ref = React.useRef<T | undefined>();

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export function useLogChanges<T>(value: T) {
  const previousValue = usePrevious<T>(value);
  const changes = getChanges<T>(previousValue, value);

  if (changes.length) {
    changes.forEach(change => {
      console.log(change);
    });
  }
}

type Comparison<T> = {
  name?: string;
  previousValue: T | undefined;
  currentValue: T;
};

type ChangeResults<T> = Array<Comparison<T>>;

function getChanges<T>(
  previousValue: T | undefined,
  currentValue: T
): ChangeResults<T> {
  // Handle non-null objects
  if (
    typeof previousValue === 'object' &&
    previousValue !== null &&
    typeof currentValue === 'object' &&
    currentValue !== null
  ) {
    const result = [] as ChangeResults<T>;
    const currentEntries = Object.entries(currentValue) as Array<[string, T]>;

    for (const [key, value] of currentEntries) {
      // @ts-ignore TODO: thinks `previousValue` is unknown and not an object
      const oldValue: T = previousValue[key];

      if (value !== oldValue) {
        result.push({
          name: key,
          previousValue: oldValue,
          currentValue: value,
        });
      }
    }

    return result;
  }

  // Handle primitive values
  if (previousValue !== currentValue) {
    return [{ previousValue, currentValue }];
  }

  return [];
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
