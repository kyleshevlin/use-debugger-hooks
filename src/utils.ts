export type Change<T> = {
  name?: string;
  previousValue: T | undefined;
  currentValue: T;
};

type Changes<T> = Array<Change<T>>;

export function getChanges<T>(
  previousValue: T | undefined,
  currentValue: T
): Changes<T> {
  // Handle non-null objects
  if (
    typeof previousValue === 'object' &&
    previousValue !== null &&
    typeof currentValue === 'object' &&
    currentValue !== null
  ) {
    const result = [] as Changes<T>;
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
