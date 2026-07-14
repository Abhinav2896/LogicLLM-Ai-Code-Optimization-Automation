# JavaScript Best Practices

## Const and Let

Always use `const` by default. Use `let` only when you need to reassign a variable. Never use `var` as it has function-scoped semantics that lead to confusing behavior.

```javascript
const MAX_RETRIES = 3;
let currentRetry = 0;
```

## Arrow Functions

Use arrow functions for callbacks and short anonymous functions. They provide cleaner syntax and lexically bind `this`.

```javascript
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(n => n * 2);
```

## Optional Chaining

Use optional chaining (`?.`) to safely access nested properties without explicit null checks.

```javascript
const city = user?.address?.city ?? 'Unknown';
```

## Nullish Coalescing

Use nullish coalescing (`??`) to provide default values only for null or undefined, not for other falsy values like `0` or `""`.

```javascript
const timeout = config.timeout ?? 3000;
```

## Destructuring

Use destructuring to extract multiple values from objects and arrays.

```javascript
const { name, age } = user;
const [first, second, ...rest] = items;
```

## Template Literals

Use template literals for string interpolation and multi-line strings.

```javascript
const message = `Hello, ${name}! The count is ${items.length}.`;
```

## Async/Await

Prefer `async/await` over raw promises for better readability. Keep async functions short and focused.

```javascript
async function fetchUserData(userId) {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
}
```

## Promise.all

Use `Promise.all` for parallel async operations when possible. It waits for all promises to resolve before continuing.

```javascript
const [users, posts] = await Promise.all([
  fetchUsers(),
  fetchPosts()
]);
```

## Strict Equality

Always use `===` and `!==` instead of `==` and `!=`. Strict equality avoids type coercion bugs.

```javascript
if (value === null) { }
```

## Event Listener Cleanup

Remove event listeners when they're no longer needed to prevent memory leaks and unexpected behavior.

```javascript
element.removeEventListener('click', handler);
```

## Module Imports

Use ES6 module syntax (`import/export`) over CommonJS (`require/module.exports`).

```javascript
import { helperFunction } from './utils.js';
export { helperFunction };
```

## Avoid Callback Hell

Nest async operations through promises or async/await, not through nested callbacks.

```javascript
async function processData() {
  const raw = await readFile();
  const validated = await validate(raw);
  return await transform(validated);
}
```

## Object Property Shorthand

Use property shorthand when property names match variable names.

```javascript
const name = 'Alice';
const user = { name }; // Same as { name: name }
```

## Array Methods

Use built-in array methods like `map`, `filter`, `reduce` instead of explicit loops for better readability.

```javascript
const adults = users.filter(u => u.age >= 18);
const names = users.map(u => u.name);
```
