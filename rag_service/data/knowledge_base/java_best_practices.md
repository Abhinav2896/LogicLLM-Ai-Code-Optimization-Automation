# Java Best Practices

## Optional for Null Returns

Use `Optional<T>` instead of returning null for methods that may not have a value. This forces callers to handle the absence of a value explicitly.

```java
public Optional<User> findById(Long id) {
    return Optional.ofNullable(database.find(id));
}

Optional<User> user = userService.findById(1L);
user.ifPresent(u -> System.out.println(u.getName()));
```

## Stream API

Use the Stream API for processing collections. It provides declarative, functional-style operations.

```java
List<String> names = users.stream()
    .filter(u -> u.getAge() >= 18)
    .map(User::getName)
    .collect(Collectors.toList());
```

Avoid streams for simple operations that are clearer with loops. Don't overuse streams for side-effect-free operations on large datasets.

## Try-With-Resources

Always use try-with-resources for resources that need cleanup. It ensures resources are closed even when exceptions occur.

```java
try (BufferedReader reader = new BufferedReader(new FileReader("file.txt"))) {
    return reader.readLine();
}
```

## Immutable Objects

Prefer immutable objects. They are thread-safe by design and prevent unexpected state changes.

```java
public class Point {
    private final int x;
    private final int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() { return x; }
    public int getY() { return y; }
}
```

## StringBuilder Over Concatenation

Use `StringBuilder` for building strings in loops or when concatenating multiple strings. String concatenation in loops creates many intermediate objects.

```java
StringBuilder sb = new StringBuilder();
for (String item : items) {
    sb.append(item).append(",");
}
```

For simple one-line concatenations, using `+` is acceptable.

## Interface Segregation

Design small, focused interfaces. Clients shouldn't depend on methods they don't use.

```java
interface Readable {
    String read();
}

interface Writable {
    void write(String data);
}

interface FileOperations extends Readable, Writable {
}
```

## Dependency Injection

Use constructor injection for dependencies. It makes dependencies explicit and facilitates testing.

```java
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }
}
```

## Equals and HashCode

Always override both `equals()` and `hashCode()` together when you override one. Objects used in HashMap, HashSet, or HashSet must be consistent in their implementations.

```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    User user = (User) o;
    return Objects.equals(id, user.id) && Objects.equals(name, user.name);
}

@Override
public int hashCode() {
    return Objects.hash(id, name);
}
```

## Checked vs Unchecked Exceptions

Use checked exceptions for recoverable conditions that callers should handle. Use unchecked exceptions for programming errors that indicate bugs.

```java
// Checked - caller should handle
public void readFile(String path) throws IOException { }

// Unchecked - indicates programming error
public void process(Object input) {
    if (input == null) {
        throw new IllegalArgumentException("Input cannot be null");
    }
}
```

## Builder Pattern

Use the builder pattern for objects with many constructor parameters. It provides clarity and flexibility.

```java
User user = User.builder()
    .name("Alice")
    .email("alice@example.com")
    .age(30)
    .build();
```

## Return Empty Collections

Return empty collections or arrays instead of null from methods that return collections. This prevents NullPointerException in callers.

```java
public List<String> getTags() {
    return tags != null ? tags : Collections.emptyList();
}
```
