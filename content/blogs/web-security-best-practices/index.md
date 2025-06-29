---
title: "Essential Web Security Best Practices for 2024"
date: "2024-02-28"
coverImage: "./assets/cover.jpg"
excerpt: "A comprehensive guide to modern web security practices, including HTTPS, CSP, XSS prevention, and more."
---

# Essential Web Security Best Practices for 2024

Security is crucial for modern web applications. Let's explore essential security practices that every developer should implement.

## HTTPS Implementation

Always use HTTPS and configure it properly:

```javascript
// Express.js HTTPS redirect
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

## Content Security Policy (CSP)

Implement a strong CSP:

```javascript
// Express.js CSP middleware
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https://api.example.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
  },
}));
```

## XSS Prevention

Prevent Cross-Site Scripting:

```typescript
// React component with XSS prevention
function SafeHTML({ content }: { content: string }) {
  // Use DOMPurify to sanitize HTML
  const clean = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href']
  });
  
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}
```

## CSRF Protection

Implement CSRF tokens:

```typescript
// Express.js CSRF protection
import csrf from 'csurf';

app.use(csrf({ cookie: true }));

app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

// React form with CSRF token
function SecureForm() {
  return (
    <form action="/api/submit" method="POST">
      <input type="hidden" name="_csrf" value={csrfToken} />
      <input type="text" name="data" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Authentication Best Practices

Implement secure authentication:

```typescript
// Password hashing
import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT implementation
import jwt from 'jsonwebtoken';

function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
}
```

## Rate Limiting

Implement rate limiting:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});

app.use('/api/', limiter);
```

## Security Headers

Set security headers:

```typescript
import helmet from 'helmet';

app.use(helmet({
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'
  },
  noSniff: true,
  xssFilter: true
}));
```

## Best Practices

1. Keep dependencies updated
2. Use security linters
3. Implement proper logging
4. Regular security audits
5. Use prepared statements
6. Input validation
7. Output encoding

## Conclusion

Security is not a one-time implementation but an ongoing process. Regularly review and update your security measures to protect against new threats and vulnerabilities. 