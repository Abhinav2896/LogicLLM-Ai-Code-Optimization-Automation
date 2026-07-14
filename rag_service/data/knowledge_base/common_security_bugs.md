# Common Security Bugs

## SQL Injection

Never concatenate user input directly into SQL queries. Always use parameterized queries or prepared statements.

```java
// VULNERABLE
String query = "SELECT * FROM users WHERE name = '" + userName + "'";

// SECURE
PreparedStatement stmt = connection.prepareStatement(
    "SELECT * FROM users WHERE name = ?"
);
stmt.setString(1, userName);
```

## Cross-Site Scripting (XSS)

Always escape user input when rendering it in HTML. Use context-aware encoding based on where the data appears.

```javascript
// VULNERABLE - direct HTML insertion
element.innerHTML = userInput;

// SECURE - text content or proper encoding
element.textContent = userInput;
```

For React, avoid dangerouslySetInnerHTML. If needed, use a sanitization library like DOMPurify.

## Insecure Deserialization

Never deserialize untrusted data. Deserialization attacks can lead to remote code execution.

```java
// VULNERABLE
ObjectInputStream ois = new ObjectInputStream(inputStream);
Object obj = ois.readObject();

// Use JSON or other safe formats instead
```

## Hardcoded Credentials

Never hardcode passwords, API keys, or secrets in source code. Use environment variables or secure secret management systems.

```java
// VULNERABLE
String apiKey = "sk-1234567890abcdef";

// SECURE - use environment variables
String apiKey = System.getenv("API_KEY");
```

## Path Traversal

Validate and sanitize file paths provided by users. Prevent attackers from accessing files outside the intended directory.

```python
# VULNERABLE
return open(user_provided_path).read()

# SECURE
from pathlib import Path
base = Path("/safe/directory").resolve()
requested = (base / user_provided_path).resolve()
if not requested.startswith(base):
    raise ValueError("Invalid path")
```

## Cross-Site Request Forgery (CSRF)

Protect state-changing operations with anti-CSRF tokens. Ensure requests originate from legitimate forms.

```html
<form method="POST">
  <input type="hidden" name="csrf_token" value="{{ csrf_token }}">
</form>
```

## Insecure Direct Object References

Validate that users have permission to access the specific resource they're requesting.

```java
// VULNERABLE - any user can access any document
@GetMapping("/documents/{id}")
public Document getDocument(@PathVariable Long id) {
    return documentRepository.findById(id).get();
}

// SECURE - verify ownership
@GetMapping("/documents/{id}")
public Document getDocument(@PathVariable Long id) {
    Document doc = documentRepository.findById(id).get();
    if (!doc.getOwner().equals(currentUser)) {
        throw new AccessDeniedException();
    }
    return doc;
}
```

## Sensitive Data in Logs

Never log passwords, tokens, API keys, or other sensitive data. Mask or exclude sensitive fields.

```java
// VULNERABLE
logger.info("User login: " + username + " password: " + password);

// SECURE
logger.info("User login attempt for: " + username);
// Never log the actual password
```

## Weak Hashing Algorithms

Never use MD5 or SHA1 for password hashing. They are cryptographically broken. Use bcrypt, scrypt, or Argon2.

```python
# VULNERABLE
import hashlib
hashed = hashlib.md5(password.encode()).hexdigest()

# SECURE
import bcrypt
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
```

## JWT Pitfalls

Be cautious with JWT implementation. Validate the algorithm, check expiration, and verify signatures properly.

```javascript
// VULNERABLE - algorithm not specified, allows alg:none attack
const token = jwt.sign(payload, { algorithm: 'none' });

// SECURE - specify expected algorithm, verify signature
const decoded = jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ['HS256']
});
```

## Race Conditions

Protect against race conditions in concurrent operations. Use atomic operations or proper locking mechanisms.

```python
# VULNERABLE - race condition between check and update
if user.credits > 0:
    user.credits -= 1
    db.commit()

# SECURE - atomic update
updated = db.query(
    "UPDATE users SET credits = credits - 1 WHERE id = ? AND credits > 0",
    user.id
)
if updated == 0:
    raise ValueError("Insufficient credits")
```

## Server-Side Request Forgery (SSRF)

Validate and sanitize URLs provided by users before making requests. Block internal IP ranges.

```python
# VULNERABLE
response = requests.get(user_provided_url)

# SECURE - validate URL
from urllib.parse import urlparse
parsed = urlparse(user_provided_url)
if parsed.hostname in ALLOWED_HOSTS and parsed.scheme == 'https':
    response = requests.get(user_provided_url)
```
