type Values<T> = {
  previousValue: T | undefined;
  currentValue: T;
};

export type Change<T> =
  | Values<T>
  | (Values<T> & { name: string })
  | (Values<T> & { index: number })
  | { onlyInPrevious: Set<unknown>; onlyInCurrent: Set<unknown> };

type Changes<T> = Array<Change<T>>;

export function getChanges<T>(
  previousValue: T | undefined,
  currentValue: T
): Changes<T> {
  // Nulls
  if (
    (previousValue === null || currentValue === null) &&
    previousValue !== currentValue
  ) {
    return [{ previousValue, currentValue }];
  }

  // Arrays
  if (Array.isArray(previousValue) && Array.isArray(currentValue)) {
    return handleArrays<T>(previousValue, currentValue);
  }

  // Sets
  if (previousValue instanceof Set && currentValue instanceof Set) {
    return handleSets(previousValue, currentValue);
  }

  // Maps
  if (previousValue instanceof Map && currentValue instanceof Map) {
    return handleMaps(previousValue, currentValue);
  }

  // Objects
  if (typeof previousValue === 'object' && typeof currentValue === 'object') {
    return handleObjects<T>(previousValue, currentValue);
  }

  // Primitives
  if (previousValue !== currentValue) {
    return [{ previousValue, currentValue }];
  }

  return [];
}

function handleArrays<T>(previous: T, current: T) {
  if (!Array.isArray(previous) || !Array.isArray(current)) {
    throw new Error('Values are not arrays');
  }

  const result = [] as Changes<T>;

  current.forEach((value, index) => {
    const oldValue = previous[index];
    if (value !== oldValue) {
      result.push({
        index,
        previousValue: oldValue,
        currentValue: value,
      });
    }
  });

  return result;
}

function handleObjects<T extends { [key: string]: any }>(
  previous: T,
  current: T
) {
  const result = [] as Changes<T>;
  const entries = Object.entries(current) as [string, any][];

  for (const [key, value] of entries) {
    const oldValue: T = previous[key];

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

function getDifference<T>(setA: Set<T>, setB: Set<T>) {
  const result = new Set();

  for (let element of setA) {
    if (!setB.has(element)) {
      result.add(element);
    }
  }

  return result;
}

function handleSets<T extends Set<any>>(previous: T, current: T) {
  const onlyInPrevious = getDifference<T>(previous, current);
  const onlyInCurrent = getDifference<T>(current, previous);
  return [{ onlyInPrevious, onlyInCurrent }];
}

function handleMaps<T extends Map<any, any>>(previous: T, current: T) {
  const result = [] as Changes<T>;

  for (const [key, value] of current.entries()) {
    const oldValue = previous.get(key);

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
