---
title: "Mastering TypeScript: Advanced Patterns and Best Practices"
date: "2024-03-10"
coverImage: "./assets/cover.jpg"
excerpt: "Deep dive into advanced TypeScript patterns, including generics, utility types, and best practices for large-scale applications."
isFeatured: true
showTags: true
techStack: ["TypeScript", "JavaScript", "Node.js", "Development"]
---

# Mastering TypeScript: Advanced Patterns and Best Practices

TypeScript has become the go-to language for building large-scale JavaScript applications. In this post, we'll explore advanced patterns and best practices that will help you write more maintainable code.

## Generic Types

Generics are one of TypeScript's most powerful features. Here's how to use them effectively:

```typescript
interface Repository<T> {
  find(id: string): Promise<T>;
  save(item: T): Promise<void>;
  update(id: string, item: Partial<T>): Promise<void>;
  delete(id: string): Promise<void>;
}

// Implementation example
class UserRepository implements Repository<User> {
  async find(id: string): Promise<User> {
    // Implementation
  }
  // ... other methods
}
```

## Utility Types

TypeScript provides several utility types that can make your code more expressive:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// Only pick certain properties
type UserDTO = Pick<User, 'id' | 'name' | 'email'>;

// Make all properties optional
type PartialUser = Partial<User>;

// Make all properties required
type RequiredUser = Required<User>;
```

## Type Guards

Type guards help you narrow down types in a type-safe way:

```typescript
interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim(); // TypeScript knows pet is Fish
  } else {
    pet.fly(); // TypeScript knows pet is Bird
  }
}
```

## Conditional Types

Conditional types allow you to create more flexible type definitions:

```typescript
type IsString<T> = T extends string ? true : false;

// Examples
type A = IsString<string>; // true
type B = IsString<number>; // false

// More practical example
type ArrayOrSingle<T> = T extends any[] ? T : T[];

function ensureArray<T>(value: T): ArrayOrSingle<T> {
  return Array.isArray(value) ? value : [value] as ArrayOrSingle<T>;
}
```

## Mapped Types

Mapped types help you transform existing types into new ones:

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Optional<T> = {
  [P in keyof T]?: T[P];
};

// Example usage
interface Config {
  endpoint: string;
  apiKey: string;
  timeout: number;
}

type ReadonlyConfig = Readonly<Config>;
type OptionalConfig = Optional<Config>;
```

## Best Practices

1. **Use strict mode**
   ```json
   {
     "compilerOptions": {
       "strict": true
     }
   }
   ```

2. **Prefer interfaces over type aliases** for object types
   ```typescript
   // Good
   interface User {
     name: string;
     age: number;
   }

   // Less ideal for objects
   type User = {
     name: string;
     age: number;
   };
   ```

3. **Use const assertions** for literal types
   ```typescript
   const config = {
     endpoint: "api.example.com",
     method: "POST"
   } as const;
   ```

4. **Leverage discriminated unions**
   ```typescript
   interface Success {
     type: "success";
     data: unknown;
   }

   interface Error {
     type: "error";
     message: string;
   }

   type Result = Success | Error;
   ```

## Conclusion

TypeScript's type system is incredibly powerful when used correctly. By understanding and applying these advanced patterns, you can write more maintainable and type-safe code. Remember that types are not just for catching errors - they're also documentation for your code and tools for better developer experience. 