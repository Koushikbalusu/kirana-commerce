# Engineering Constitution

**Document Version:** 1.0  
**Status:** Approved  
**Priority:** Highest  
**Last Updated:** YYYY-MM-DD

---

# Purpose

This document defines the immutable engineering principles governing the development of the Kirana Commerce System.

Every AI assistant, developer, or contributor must follow this constitution before implementing, modifying, or reviewing any part of the project.

If any instruction conflicts with this document, this document takes precedence unless the project owner explicitly approves a change.

---

# Core Philosophy

The repository is the single source of truth.

Conversations are temporary.

The repository is permanent.

Engineering decisions must always be derived from the repository rather than relying on previous chat history or assumptions.

---

# Repository First

Before making any implementation decision, always understand the current repository state.

Never assume the repository matches previous conversations.

Always inspect the existing project before proposing changes.

---

# Documentation First

Documentation defines implementation.

Implementation does not define documentation.

Before implementing any significant feature:

- Read the relevant specifications.
- Understand the business rules.
- Understand the architecture.
- Understand previous engineering decisions.

Never skip documentation analysis.

---

# Planning Before Coding

No implementation begins immediately.

Every implementation must begin with planning.

The planning phase must complete before writing code.

Every plan should include:

- Repository analysis
- Relevant specifications
- Current implementation status
- Dependencies
- Risks
- Files expected to change
- Step-by-step implementation strategy

Implementation begins only after approval.

---

# Approval Policy

Minor implementation work may proceed after the implementation plan is approved.

The following always require explicit approval before implementation:

- Architecture changes
- Folder structure changes
- Technology stack changes
- Database redesign
- Authentication redesign
- Authorization redesign
- Breaking API changes
- Specification changes
- AI workflow changes

Never assume approval.

---

# Source of Truth Hierarchy

Engineering decisions must follow this priority order.

1. specifications/
2. .ai/
3. Existing implementation
4. User instructions for the current session

Higher priority sources always override lower priority sources.

---

# Business Before Technology

Business requirements always take priority over technical preferences.

The project exists to solve business problems.

Technology is a tool.

Never introduce unnecessary complexity.

---

# Simplicity

Prefer the simplest architecture that satisfies current requirements.

Do not implement speculative features.

Avoid premature optimization.

Avoid unnecessary abstractions.

---

# MVP First

Always implement the smallest complete solution.

Future features should not complicate the current implementation.

The current scope is:

- Single Store
- Multi-store Ready Architecture

Do not implement marketplace functionality.

Do not implement multi-store UI.

---

# Architecture Stability

The architecture is considered frozen.

Do not redesign the architecture unless explicitly instructed.

Avoid introducing architectural drift.

Protect long-term maintainability.

---

# Reuse Before Creation

Before creating:

- Components
- Hooks
- Utilities
- Services
- Types
- Validation Schemas

Always search the repository for an existing implementation.

Reuse before creating new code.

---

# Consistency

Maintain consistency throughout the project.

Examples include:

- Naming
- Folder organization
- API design
- Error handling
- Validation
- Logging
- Styling
- Documentation

Consistency is preferred over personal preference.

---

# Security

Security is mandatory.

Never expose sensitive information.

Always validate input.

Always enforce authorization on the server.

Never rely solely on frontend restrictions.

---

# Performance

Performance is a feature.

Every implementation should consider:

- Bundle size
- Database efficiency
- Image optimization
- Rendering strategy
- Network requests

Avoid unnecessary computation.

---

# Mobile First

The customer experience is mobile-first.

Every UI should work correctly on mobile devices before desktop enhancements.

---

# Role-Based Platform

The project consists of one application.

Not multiple applications.

Customer

↓

Administrator

↓

Delivery Partner

↓

Super Administrator

All interfaces exist inside the same platform.

Access is determined by authentication and authorization.

---

# Platform Evolution

Current Deployment

Responsive Web Application

Future Evolution

Progressive Web App

↓

Android Application using Capacitor

↓

Native Device Features

Do not create separate codebases.

---

# Code Quality

Code should prioritize:

- Readability
- Maintainability
- Simplicity
- Predictability

Avoid clever code.

Prefer understandable code.

---

# Documentation Synchronization

Documentation is part of implementation.

Whenever a significant engineering decision changes:

Update the corresponding documentation.

The repository should never become inconsistent.

---

# Git Discipline

Every completed implementation should result in a clean Git state.

Avoid unrelated modifications.

Group commits logically.

Never mix unrelated features.

---

# Self Review

Before completing any implementation:

Review the solution as another engineer would.

Verify:

- Business requirements
- Code quality
- Security
- Performance
- Documentation
- Tests

Correct obvious issues before presenting the result.

---

# Continuous Improvement

Improve the codebase incrementally.

Leave the repository better than it was found.

Avoid unnecessary rewrites.

Favor gradual improvement.

---

# Engineering Mindset

Think like a senior software engineer.

Understand before changing.

Plan before implementing.

Implement with discipline.

Validate before completing.

Document before finishing.

Commit only when the work is complete.

---

# Constitution Summary

Every engineering task follows this sequence:

Understand

↓

Analyze

↓

Plan

↓

Wait for Approval

↓

Implement

↓

Validate

↓

Document

↓

Commit

↓

Complete

This workflow is mandatory for all contributors and AI assistants working on the Kirana Commerce System.
