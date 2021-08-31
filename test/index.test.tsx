import { renderHook } from '@testing-library/react-hooks';
import { useLogChanges } from '../src';

type Logger = (x: any) => void;
type Logs = any[];
type LoggerTuple = [Logger, Logs];

/**
 * This creates a `logger` function with `logs` stored in closure.
 * This allows us to test `useLogChanges` with a logger than doesn't
 * output to the console, but rather pushes the results into the `logs`
 * so we can verify that they are what we expect them to be.
 */
function createLogger(): LoggerTuple {
  const logs = [] as any[];
  const logger = (x: any) => {
    logs.push(x);
  };

  return [logger, logs];
}

test('useLogChanges', () => {
  const [logger, logs] = createLogger();
  let initialValue = 0;
  const { rerender } = renderHook(() => useLogChanges(initialValue, logger));

  expect(logs).toEqual([{ previousValue: undefined, currentValue: 0 }]);

  initialValue = 1;
  rerender();

  expect(logs).toEqual([
    { previousValue: undefined, currentValue: 0 },
    { previousValue: 0, currentValue: 1 },
  ]);
});
