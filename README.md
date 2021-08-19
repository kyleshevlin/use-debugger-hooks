# use-debugger-hooks

This is a package of custom React hooks that are useful for debugging dependency changes between renders. They act as drop in replacements for their React hook counterpart. The available hooks include.

- `useCallbackDebugger`
- `useEffectDebugger`
- `useLayoutEffectDebugger`
- `useMemoDebugger`

Each of these debugging hooks is a pass through to their React hook counterpart, so their behavior is exactly the same. Under the hood, we track the changes for each dependency and log them out if they are different, thus allowing you to debug your problems.

## Usage

Say you have a `useEffect` hook running more often than you expect and you want to see which dependency is causing that to happen. Replace `useEffect` with `useEffectDebugger` and then see the changes in the browser's console.

```javascript
useEffect(() => {
  someEffectWithDeps(dep1, dep2, dep3);
}, [dep1, dep2, dep3]);

// Add debugging
useEffectDebugger(() => {
  someEffectWithDeps(dep1, dep2, dep3);
}, [dep1, dep2, dep3]);
```
