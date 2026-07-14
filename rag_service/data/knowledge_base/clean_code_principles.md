# Clean Code Principles

## Single Responsibility Principle

Each class and function should have one reason to change. If a function does multiple things, split it into separate functions.

```python
# VIOLATION - multiple responsibilities
def save_and_send_email(user):
    database.save(user)
    email_service.send(user.email)

# COMPLIANT - separate concerns
def save_user(user):
    database.save(user)

def notify_user(user):
    email_service.send(user.email)
```

## Meaningful Names

Use descriptive names that reveal intent. Avoid abbreviations and single letters except in short loops.

```python
# UNCLEAR
def calc(o, p, w):
    return o * w + p * 0.1

# CLEAR
def calculate_total(base_price, discount, tax_rate):
    return base_price * (1 - discount) + base_price * tax_rate
```

## Functions Do One Thing

Functions should perform a single operation. If you need "and" to describe what a function does, it should be split.

```python
# DOES MULTIPLE THINGS
def process_order(order):
    validate_order(order)
    calculate_total(order)
    save_to_database(order)
    send_confirmation(order)

# DOES ONE THING
def process_order(order):
    validated = validate_order(order)
    total = calculate_total(validated)
    saved = save_to_database(total)
    send_confirmation(saved)
```

## DRY Principle

Don't Repeat Yourself. Extract duplicated logic into reusable functions or classes.

```python
# REPEATED
if user.age >= 18:
    grant_access(user)
if user.age >= 18:
    log_access_granted(user)

# DRY
if user.age >= 18:
    grant_access(user)
    log_access_granted(user)
```

## Avoid Magic Numbers

Use named constants instead of hardcoded numbers. Numbers without context are difficult to understand.

```python
# MAGIC NUMBER
if delay > 86400:
    raise TimeoutError()

# NAMED CONSTANT
MAX_DELAY_SECONDS = 86400
if delay > MAX_DELAY_SECONDS:
    raise TimeoutError()
```

## Comment the Why, Not the What

Comments should explain why code exists, not what it does. The code itself should be clear enough to show what.

```python
# BAD - explains what
# Increment counter by 1
counter += 1

# GOOD - explains why
# Compensate for off-by-one error in upstream service
counter += 1
```

## Small Functions

Keep functions under 20 lines when possible. Smaller functions are easier to test and understand.

```python
def process_payment(order):
    # Extract validation
    if not validate_payment(order):
        raise PaymentError()

    # Extract charging
    charge(order)

    # Extract receipt
    send_receipt(order)
```

## Pure Functions

Prefer pure functions that produce the same output for the same input without side effects.

```python
# IMPURE - modifies global state
total = 0
def add_to_total(value):
    global total
    total += value

# PURE - returns value, no side effects
def calculate_total(values):
    return sum(values)
```

## Separation of Concerns

Organize code so different concerns are in different modules. Don't mix data access, business logic, and presentation.

```
controllers/    - Handle HTTP requests
services/       - Business logic
repositories/   - Data access
models/         - Data structures
```

## Fail Fast

Validate inputs early and throw errors immediately when something is wrong. Don't propagate bad data.

```python
def divide(a, b):
    if b == 0:
        raise ValueError("Division by zero")
    return a / b
```

## Prefer Composition Over Inheritance

Use composition for code reuse rather than deep inheritance hierarchies.

```python
# INHERITANCE - rigid
class Dog(Animal):
    def speak(self): return "bark"

# COMPOSITION - flexible
class Barking:
    def speak(self): return "bark"

class Dog:
    def __init__(self):
        self.speaker = Barking()

    def speak(self): return self.speaker.speak()
```

## Keep Code Linear

Avoid deeply nested code. Each level of nesting increases cognitive load. Extract logic into functions or use early returns.

```python
# DEEPLY NESTED
def process(items):
    if items:
        for item in items:
            if item.is_valid():
                if item.value > 0:
                    handle(item)

# FLAT - early return
def process(items):
    if not items:
        return

    for item in items:
        if not item.is_valid():
            continue
        if item.value <= 0:
            continue
        handle(item)
```
