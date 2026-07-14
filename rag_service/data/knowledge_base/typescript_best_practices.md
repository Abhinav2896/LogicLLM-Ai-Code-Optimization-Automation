# TypeScript Best Practices

## Strict Mode

Always enable strict mode in `tsconfig.json`. This enables `strictNullChecks`, `noImplicitAny`, and other safety checks that catch common errors.

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

## Interface vs Type Alias

Use `interface` for object shapes that may be extended. Use `type` for unions, intersections, and primitives.

```typescript
interface User {
  id: string;
  name: string;
}

type Status = 'pending' | 'active' | 'closed';
```

## Avoid Any

Never use `any`. Use `unknown` for truly unknown types and narrow them with type guards. Use specific types whenever possible.

```typescript
function processInput(input: unknown): string {
  if (typeof input === 'string') {
    return input.toUpperCase();
  }
  throw new Error('Invalid input');
}
```

## Generics

Use generics to write reusable, type-safe code. Constrain generics when you need specific capabilities.

```typescript
function first<T extends Array<unknown>>(arr: T): T[0] | undefined {
  return arr[0];
}
```

## Utility Types

Use built-in utility types to create variations of existing types.

```typescript
type PartialUser = Partial<User>;
type UserPreview = Pick<User, 'id' | 'name'>;
type UpdatedUser = Omit<User, 'createdAt'>;
```

## Discriminated Unions

Use discriminated unions for handling multiple related states. The discriminant property helps TypeScript narrow the type.

```typescript
type Result =
  | { status: 'success'; data: User }
  | { status: 'error'; error: string };

function handle(result: Result) {
  if (result.status === 'success') {
    console.log(result.data);
  } else {
    console.error(result.error);
  }
}
```

## Readonly

Use `readonly` for properties that should not be modified after initialization.

```typescript
interface Config {
  readonly apiUrl: string;
  readonly maxRetries: number;
}
```

## Type Narrowing

Use type guards and narrowing to refine types. Check for specific properties or use custom type guards.

```typescript
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && 'id' in obj && 'name' in obj;
}
```

## Non-Null Assertion

Avoid the non-null assertion operator (`!`) except in cases where you've provably checked the value. It bypasses type safety.

```typescript
const name = user.name; // string | undefined
const name = user.name!; // Dangerous - bypasses type check
```

## Enum Alternatives

Prefer union types over enums for simpler semantics. If you need enums, consider const enums for better performance.

```typescript
type Direction = 'north' | 'south' | 'east' | 'west';

const enum Direction {
  North = 'north',
  South = 'south',
}
```

## Function Types

Explicitly type function parameters and return values. Use void return type for functions that don't return meaningful values.

```typescript
type Logger = (message: string) => void;

function log(logger: Logger): void {
  logger('Operation completed');
}
```

## Async Function Types

Type async functions with `Promise<T>` return types. Don't mix promise and non-promise returns.

```typescript
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/users/${id}`);
  return response.json();
}
```
