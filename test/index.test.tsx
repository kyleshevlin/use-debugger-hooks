import { renderHook } from '@testing-library/react-hooks';
import { useLogChanges } from '../src';

/**
 * This creates a `logger` function with `logs` stored in closure.
 * This allows us to test `useLogChanges` with a logger than doesn't
 * output to the console, but rather pushes the results into the `logs` array
 * so we can verify that they are what we expect them to be.
 */
function createLogger(): {
  clearLogs: () => void;
  getLogs: () => any[];
  logger: (x: any) => void;
} {
  let logs = [] as any[];

  const logger = (...x: any[]) => {
    logs.push(...x);
  };

  return {
    clearLogs: () => {
      logs = [];
    },
    getLogs: () => {
      return logs;
    },
    logger,
  };
}

describe('useLogChanges', () => {
  const { clearLogs, getLogs, logger } = createLogger();

  beforeEach(() => {
    clearLogs();
  });

  it('should log out any changes that occur between renders', () => {
    let initialValue = 0;

    const { rerender } = renderHook(() =>
      useLogChanges(initialValue, undefined, logger)
    );

    expect(getLogs()).toEqual([{ previousValue: undefined, currentValue: 0 }]);

    // A rerender with no changes
    clearLogs();
    rerender();

    expect(getLogs()).toEqual([]);

    // A rerender with changes
    clearLogs();
    initialValue = 1;
    rerender();

    expect(getLogs()).toEqual([{ previousValue: 0, currentValue: 1 }]);
  });

  it('should log out the provided label as well as any changes', () => {
    let initialValue = 0;
    const label = 'TEST LABEL';

    const { rerender } = renderHook(() =>
      useLogChanges(initialValue, label, logger)
    );

    expect(getLogs()).toEqual([
      label,
      { previousValue: undefined, currentValue: 0 },
    ]);

    // A rerender with no changes
    clearLogs();
    rerender();

    expect(getLogs()).toEqual([]);

    // A rerender with changes
    clearLogs();
    initialValue = 1;
    rerender();

    expect(getLogs()).toEqual([label, { previousValue: 0, currentValue: 1 }]);
  });
});
