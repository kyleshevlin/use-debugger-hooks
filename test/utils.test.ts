import { getChanges } from '../src/utils';

test('getChanges', () => {
  expect(getChanges(0, 0)).toEqual([]);
  expect(getChanges(0, 1)).toEqual([{ previousValue: 0, currentValue: 1 }]);
  expect(getChanges({ foo: 'foo' }, { foo: 'bar' })).toEqual([
    {
      name: 'foo',
      previousValue: 'foo',
      currentValue: 'bar',
    },
  ]);
  expect(getChanges([0], [1])).toEqual([
    {
      name: '0',
      previousValue: 0,
      currentValue: 1,
    },
  ]);
});
