type Comparison<T> = {
  name?: string;
  previousValue: T | undefined;
  currentValue: T;
};

type ChangeResults<T> = Array<Comparison<T>>;

export function getChanges<T>(
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
