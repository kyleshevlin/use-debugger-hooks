import { getChanges } from '../src/utils';

describe('getChanges', () => {
  it('should return an empty array when there are no changes', () => {
    expect(getChanges(0, 0)).toEqual([]);
  });

  it('should return an object of the different values for primitives', () => {
    expect(getChanges(0, 1)).toEqual([{ previousValue: 0, currentValue: 1 }]);
  });

  it('should return an object of the different values if one is null', () => {
    expect(getChanges([1], null)).toEqual([
      {
        previousValue: [1],
        currentValue: null,
      },
    ]);
  });

  it('should indicate the key for differences in object values', () => {
    expect(getChanges({ foo: 'foo' }, { foo: 'bar' })).toEqual([
      {
        name: 'foo',
        previousValue: 'foo',
        currentValue: 'bar',
      },
    ]);
  });

  it('should indicate the index for differences in array values', () => {
    expect(getChanges([0], [1])).toEqual([
      {
        index: 0,
        previousValue: 0,
        currentValue: 1,
      },
    ]);
  });

  it('should handle Sets', () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([2, 3, 4]);

    expect(getChanges(set1, set2)).toEqual([
      {
        onlyInPrevious: new Set([1]),
        onlyInCurrent: new Set([4]),
      },
    ]);
  });

  it('should handle Maps', () => {
    const map1 = new Map();
    const map2 = new Map();

    map1.set('foo', 'foo');
    map2.set('foo', 'bar');

    expect(getChanges(map1, map2)).toEqual([
      {
        name: 'foo',
        previousValue: 'foo',
        currentValue: 'bar',
      },
    ]);
  });
});
