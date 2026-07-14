# Python Best Practices

## PEP 8 Compliance

Follow PEP 8 style guidelines for Python code. Use 4 spaces for indentation (not tabs). Limit lines to 79 characters for code and 72 for comments. Use blank lines sparingly to separate functions and classes.

## Type Hints

Use type hints for function parameters and return values. This improves code readability and enables static analysis tools to catch type errors early.

```python
def process_data(items: list[str], threshold: int) -> dict[str, int]:
    return {item: len(item) for item in items if len(item) > threshold}
```

## Exception Handling

Catch specific exceptions rather than using bare `except` clauses. This prevents catching unrelated exceptions and makes debugging easier.

```python
try:
    result = int(user_input)
except ValueError:
    result = 0
```

Avoid raising generic `Exception`. Use specific exception types that describe the error.

## Context Managers

Use `with` statements for resource management. Context managers ensure files, connections, and other resources are properly cleaned up even when exceptions occur.

```python
with open("file.txt", "r") as f:
    content = f.read()
```

## String Formatting

Use f-strings for string formatting in Python 3.6+. They are more readable and performant than older `%` formatting or `.format()`.

```python
name = "Alice"
greeting = f"Hello, {name}!"
```

## Avoid Mutable Default Arguments

Never use mutable objects like lists or dictionaries as default argument values. The default is created once at function definition time, not at call time.

```python
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
```

## Data Classes

Use `@dataclass` decorator for classes that primarily store data. It automatically generates `__init__`, `__repr__`, and other methods.

```python
from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float
```

## Pathlib

Use `pathlib.Path` instead of `os.path` for path manipulation. It provides a cleaner, object-oriented API.

```python
from pathlib import Path

config_path = Path.home() / ".config" / "app"
config_path.mkdir(parents=True, exist_ok=True)
```

## List Comprehensions

Use list comprehensions for simple transformations. They are more readable and often faster than explicit loops.

```python
squares = [x**2 for x in range(10)]
```

For complex operations with multiple conditions or side effects, prefer explicit loops for clarity.

## Module Exports

Define `__all__` to explicitly specify which names should be exported when using `from module import *`.

```python
__all__ = ['public_function', 'PublicClass']
```
