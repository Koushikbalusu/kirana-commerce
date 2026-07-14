# Documentation Rules

**Document Version:** 1.0
**Status:** Approved
**Priority:** High

---

# Purpose

This document defines how documentation must be maintained throughout the lifecycle of the Kirana Commerce System.

Documentation is treated as part of the software, not as an optional deliverable.

Implementation is not considered complete until the required documentation has been updated.

---

# Core Principle

Documentation and implementation must always remain synchronized.

Documentation should describe the current system, never a previous version of it.

---

# Repository Documentation Hierarchy

The documentation hierarchy is:

1. specifications/
2. .ai/
3. docs/
4. README.md
5. Inline code documentation

Higher-level documents define lower-level documents.

---

# Documentation Categories

## Specifications

Purpose:

Define business requirements.

Examples:

- vision.md
- business-rules.md
- functional-requirements.md

Only update with explicit approval.

---

## AI Documentation

Purpose:

Define AI engineering behavior.

Examples:

- Engineering Constitution
- Workflow
- Coding Standards

Only update with explicit approval.

---

## Project Documentation

Purpose:

Describe implementation.

Examples:

- Architecture
- APIs
- Database
- Deployment
- Setup

Update whenever implementation changes.

---

## Code Documentation

Purpose:

Explain complex implementation details.

Includes:

- Function comments
- JSDoc
- README sections
- Inline explanations

Use only where valuable.

---

# Documentation Update Rules

Whenever implementation changes, determine whether documentation must also change.

Examples:

Feature Added

↓

Update relevant docs

----------------------

API Changed

↓

Update API documentation

----------------------

Database Changed

↓

Update schema documentation

----------------------

Architecture Changed

↓

Requires approval

↓

Update architecture docs

---

# Documentation Checklist

Before completing any implementation verify:

- Documentation still accurate
- No outdated instructions
- No broken examples
- No contradictory information
- Cross references still valid

---

# Documentation Writing Principles

Documentation should be:

- Clear
- Concise
- Accurate
- Maintainable
- Consistent

Avoid unnecessary repetition.

---

# Audience

Documentation should be understandable by:

- Developers
- AI Assistants
- Future Contributors
- Project Owner

Assume no prior knowledge beyond the repository.

---

# Examples

Good

Explain:

Why something exists.

Bad

Explain every obvious line of code.

---

# Architecture Documentation

Architecture documentation should explain:

- Design decisions
- Trade-offs
- Constraints
- Relationships

Do not duplicate implementation details.

---

# API Documentation

When APIs change, document:

- Endpoint
- Purpose
- Inputs
- Outputs
- Authentication
- Error Responses

---

# Database Documentation

When schema changes:

Update:

- ER diagrams (if maintained)
- Tables
- Relationships
- Constraints
- Business rules

---

# Component Documentation

Reusable components should describe:

- Purpose
- Props
- Usage
- Limitations

Do not document trivial components.

---

# Breaking Changes

Whenever a breaking change occurs:

Document:

- What changed
- Why
- Migration steps
- Affected modules

---

# Decision Records

Important engineering decisions should be recorded.

Include:

- Decision
- Reason
- Alternatives considered
- Impact

---

# Documentation Style

Prefer:

- Short sections
- Clear headings
- Lists
- Tables
- Examples

Avoid large unstructured paragraphs.

---

# AI Responsibilities

Before ending any implementation session:

Determine:

Has documentation changed?

If yes:

Update it before considering the task complete.

Never knowingly leave documentation outdated.

---

# Documentation Review

During self-review verify:

- Documentation matches implementation.
- Terminology remains consistent.
- References are correct.
- Formatting remains consistent.

---

# Summary

Documentation is part of the product.

A feature is not complete until:

- Code is complete.
- Tests pass.
- Documentation is synchronized.

The repository should always describe the software exactly as it exists.