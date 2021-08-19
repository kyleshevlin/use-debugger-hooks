# use-debugger-hooks

This is a package of custom React hooks that are useful for debugging dependency changes between renders. Most act as drop in replacements for their React hook counterpart. The available hooks include.

- `useLogChanges`
- `useCallbackDebugger`
- `useEffectDebugger`
- `useLayoutEffectDebugger`
- `useMemoDebugger`

## Installation

```
npm install use-debugger-hooks
```

## Usage

Most of these hooks are drop in replacements for their React hook counterpart. They have the same API, but make use of `useLogChanges` under the hood to log out changes to your browser's console.

`useLogChanges` will track a value across renders, logging out any changes that occur.

```jsx
function Parent(props) {
  useLogChanges(props);

  return <Child {...props} />;
}
```

Any time that `Parent` rerenders, any changes to `props` will be logged to the console.

The other hooks in this library use `useLogChanges` to track values in the `dependencies` array. If a dependency changes across renders, it will be logged out to the console.

Say you have a `useEffect` hook running more often than you expect and you want to see which dependency is causing that to happen. Replace `useEffect` with `useEffectDebugger` and then see the changes in the browser's console.

```javascript
// Problematic effect
useEffect(() => {
  someEffectWithDeps(dep1, dep2, dep3);
}, [dep1, dep2, dep3]);

// Add debugging to log out dependency changes
import { useEffectDebugger } from 'use-debugger-hooks';

useEffectDebugger(() => {
  someEffectWithDeps(dep1, dep2, dep3);
}, [dep1, dep2, dep3]);
```

Now you'll be able to see which dependency is changing too often and be able to fix the problem.
