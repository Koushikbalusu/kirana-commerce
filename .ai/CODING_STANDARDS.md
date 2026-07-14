# Coding Standards

**Document Version:** 1.0  
**Status:** Approved  
**Priority:** High

---

# Purpose

This document defines the coding standards for the Kirana Commerce System.

Every line of code written by any AI assistant or developer must follow these standards.

Consistency is more important than personal preference.

---

# General Principles

Always write code that is:

- Readable
- Maintainable
- Predictable
- Modular
- Type-safe
- Production-ready

Avoid clever solutions.

Prefer simple solutions.

---

# Technology Standards

Language

- TypeScript

Framework

- Next.js App Router

Styling

- Tailwind CSS

Validation

- Zod

Database

- Drizzle ORM

Authentication

- Better Auth

---

# File Organization

Each file should have one clear responsibility.

Avoid files becoming excessively large.

Recommended maximums:

- Component: ~300 lines
- Hook: ~200 lines
- Utility: ~150 lines
- Route Handler: ~250 lines

Split files when responsibilities grow.

---

# Naming Conventions

Directories

- lowercase
- kebab-case

Examples

```
product-card
order-history
delivery-map
```

---

Components

PascalCase

Examples

```
ProductCard
CustomerTable
OrderSummary
```

---

Hooks

```
useCart
useCustomer
useOrders
```

---

Utilities

camelCase

```
calculateTotal
formatCurrency
compressImage
```

---

Types

PascalCase

```
Customer
Order
ProductVariant
```

---

Interfaces

PascalCase

Do not prefix with "I".

Correct

```
Customer
Product
```

Incorrect

```
ICustomer
IProduct
```

---

Enums

PascalCase

Values

UPPER_SNAKE_CASE

Example

```
OrderStatus

PLACED

DELIVERED
```

---

Constants

UPPER_SNAKE_CASE

```
MAX_UPLOAD_SIZE

DEFAULT_LANGUAGE
```

---

Functions

camelCase

Functions should perform one responsibility.

---

Components

Prefer Server Components.

Only use Client Components when required.

Never add

```
"use client"
```

unless necessary.

---

Props

Use explicit interfaces.

Avoid

```
any
```

Never disable TypeScript.

---

State

Prefer:

Server State

↓

URL State

↓

Local State

↓

Global State

Use Zustand only when shared client state is genuinely required.

---

Forms

Always use:

React Hook Form

-

Zod

Never manually validate large forms.

---

Validation

Every input must be validated.

Server validation is mandatory.

Client validation improves UX but never replaces server validation.

---

API

Prefer Server Actions.

Use Route Handlers only when necessary.

Keep API responses consistent.

---

Error Handling

Never silently ignore errors.

Always:

- Log appropriately
- Return meaningful errors
- Preserve security

Do not expose internal implementation.

---

Database

Never write raw SQL unless absolutely necessary.

Use Drizzle ORM.

Always use transactions when modifying related records.

---

Queries

Select only required fields.

Avoid unnecessary database calls.

Prevent N+1 queries.

---

Components

Prefer composition.

Avoid deeply nested component trees.

Extract reusable logic.

---

Styling

Use Tailwind utility classes.

Avoid inline styles.

Keep spacing consistent.

Use design tokens where defined.

---

Accessibility

Every interactive element should include:

- Accessible labels
- Keyboard support
- Proper semantics

Accessibility is required.

---

Performance

Avoid unnecessary:

- Re-renders
- Database queries
- API requests
- Client Components
- Bundle size increases

Measure before optimizing.

---

Comments

Write comments only when they add value.

Prefer self-documenting code.

Never explain obvious code.

Document complex business logic.

---

Imports

Group imports.

Order:

1. Framework
2. Third-party
3. Internal packages
4. Components
5. Utilities
6. Types
7. Styles

---

Magic Numbers

Avoid magic values.

Extract constants.

---

Environment Variables

Never hardcode:

- Secrets
- API Keys
- Tokens
- URLs

Use environment variables.

---

Logging

Development

Console logging allowed.

Production

Use structured logging.

Remove unnecessary debug logs.

---

Code Reuse

Before creating:

- Component
- Hook
- Utility
- Type
- Validation Schema

Search the repository.

Reuse before creating.

---

Testing Mindset

Every implementation should be written so that it can be tested easily.

Avoid tightly coupled code.

---

Architecture

Respect existing project structure.

Do not move files unnecessarily.

Do not reorganize folders without approval.

---

Definition of Good Code

Good code is:

Easy to read.

Easy to modify.

Easy to test.

Easy to debug.

Easy to extend.

---

Summary

Every implementation should leave the repository:

- Cleaner
- More consistent
- Easier to understand
- Easier to maintain

The best code is usually the simplest code that completely solves the problem.
