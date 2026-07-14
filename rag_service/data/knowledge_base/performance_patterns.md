# Performance Patterns

## Memoization

Cache expensive function results to avoid repeated computation. Use memoization for pure functions with repeated calls with the same inputs.

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
```

## Lazy Loading

Defer initialization of expensive objects until they're actually needed. This reduces startup time and memory usage.

```python
class Config:
    @property
    def database(self):
        if not hasattr(self, '_database'):
            self._database = ExpensiveDatabaseConnection()
        return self._database
```

## Pagination

Never load entire datasets into memory. Use pagination for large queries to limit memory consumption and response time.

```sql
SELECT * FROM orders
ORDER BY id
LIMIT 100 OFFSET 0;

SELECT * FROM orders
ORDER BY id
LIMIT 100 OFFSET 100;
```

## Index-Aware Queries

Ensure queries can use database indexes efficiently. Avoid functions on indexed columns in WHERE clauses.

```sql
-- SLOW - function prevents index usage
SELECT * FROM users WHERE LOWER(email) = 'test@example.com';

-- FAST - index can be used
SELECT * FROM users WHERE email = 'test@example.com';
```

## Caching Strategies

Implement caching with appropriate TTL (time-to-live) values. Use cache-aside or write-through patterns.

```python
def get_user(user_id):
    cache_key = f"user:{user_id}"
    cached = redis.get(cache_key)
    if cached:
        return json.loads(cached)

    user = database.query(user_id)
    redis.setex(cache_key, 3600, json.dumps(user))  # 1 hour TTL
    return user
```

## Avoiding N+1 Queries

Eager load related data to avoid multiple database round trips. Use JOINs or batch queries.

```python
# VULNERABLE - N+1 queries
users = database.query("SELECT * FROM users LIMIT 100")
for user in users:
    user.posts = database.query(
        f"SELECT * FROM posts WHERE user_id = {user.id}"
    )

# SECURE - single query with JOIN
users = database.query("""
    SELECT u.*, p.id as post_id, p.title
    FROM users u
    LEFT JOIN posts p ON u.id = p.user_id
""")
```

## Connection Pooling

Use connection pools to reuse database connections instead of creating new ones for each request.

```python
from psycopg2 import pool

connection_pool = pool.ThreadedConnectionPool(
    minconn=5,
    maxconn=20,
    database="mydb",
    user="user",
    password="pass"
)

conn = connection_pool.getconn()
try:
    # use connection
finally:
    connection_pool.putconn(conn)
```

## Async I/O

Use asynchronous I/O for I/O-bound operations to improve throughput. Don't block on network or disk operations.

```javascript
async function fetchAllData() {
    const [users, posts, comments] = await Promise.all([
        fetchUsers(),
        fetchPosts(),
        fetchComments()
    ]);
    return { users, posts, comments };
}
```

## Avoid Premature Optimization

Profile before optimizing. Don't optimize code until you've identified actual bottlenecks.

```python
# Before optimizing, measure
import cProfile
cProfile.run('my_function()')

# Focus optimization effort on the actual hot paths
```

## Big-O Awareness

Understand the algorithmic complexity of your code. O(n²) operations become prohibitively slow at scale.

```python
# O(n²) - slow for large lists
for i in range(len(items)):
    for j in range(len(items)):
        if items[i] == items[j]:
            count += 1

# O(n) - linear time with hash set
seen = set()
for item in items:
    if item in seen:
        count += 1
    seen.add(item)
```

## Batch Operations

Batch multiple operations together to reduce round trips and overhead.

```python
# SLOW - individual inserts
for item in items:
    db.insert("INSERT INTO logs VALUES (?)", item)

# FAST - batch insert
db.executemany("INSERT INTO logs VALUES (?)", items)
```
