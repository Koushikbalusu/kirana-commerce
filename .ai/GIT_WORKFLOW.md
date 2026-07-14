# Git Workflow

**Document Version:** 1.0
**Status:** Approved
**Priority:** High

---

# Purpose

This document defines the Git workflow for the Kirana Commerce System.

Every AI assistant and contributor must follow this workflow to maintain a clean, understandable, and traceable Git history.

Git history should tell the story of the project.

---

# Core Principle

Every commit should represent one logical unit of work.

Never mix unrelated changes in the same commit.

---

# Repository Strategy

Main Branch

- main

Development Branch

- develop

Feature Branches

- feature/<feature-name>

Bug Fix Branches

- fix/<bug-name>

Hotfix Branches

- hotfix/<issue>

Documentation Branches

- docs/<topic>

Refactor Branches

- refactor/<area>

---

# Branch Creation

Always branch from the correct base branch.

Example:

main

↓

develop

↓

feature/product-search

Never develop directly on main.

---

# Commit Principles

A commit should be:

- Small
- Atomic
- Logical
- Complete
- Reviewable

Never commit unfinished work unless explicitly instructed.

---

# Commit Message Format

Use Conventional Commits.

Examples:

```
feat(products): add multilingual product search

fix(cart): prevent duplicate cart items

refactor(api): simplify order validation

docs(specifications): update business rules

test(auth): add authentication tests

chore(deps): update dependencies
```

---

# Allowed Commit Types

- feat
- fix
- docs
- refactor
- test
- chore
- perf
- style
- build
- ci

---

# Before Every Commit

Verify:

- Code compiles
- No obvious errors
- Documentation updated
- No debug code
- No unnecessary console logs
- No temporary files
- No commented-out code

---

# Git Status

Before committing:

Run:

```
git status
```

Review every modified file.

Do not commit unknown changes.

---

# Staging

Stage only files related to the approved implementation.

Avoid:

```
git add .
```

unless every changed file belongs to the same logical task.

Prefer explicit staging.

---

# Commit Boundaries

One feature

↓

One commit (or a small related series of commits)

Do not combine:

- Authentication
- UI redesign
- Database changes

into one commit unless they belong to the same approved feature.

---

# Documentation

If documentation changed:

Include it in the same commit as the implementation.

Implementation and documentation should remain synchronized.

---

# Generated Files

Do not commit:

- Build outputs
- Temporary files
- Cache
- Local configuration
- Secrets

Respect .gitignore.

---

# Pull Requests

Before opening a Pull Request:

Verify:

- Specifications followed
- Documentation updated
- Quality Gates passed
- Clean commit history

---

# Merge Strategy

Prefer:

Squash Merge

for small feature branches.

Use Merge Commit only when preserving history is valuable.

---

# Conflict Resolution

When conflicts occur:

- Understand both versions
- Preserve business logic
- Preserve documentation
- Preserve architecture

Never resolve conflicts blindly.

---

# Rollback

When reverting:

Document:

- Why the revert occurred
- Impact
- Follow-up work

Avoid repeated revert cycles.

---

# AI Responsibilities

Before suggesting a commit:

Verify:

- Approved implementation completed
- Quality Gates passed
- Documentation synchronized
- Git status reviewed

Never suggest committing incomplete work.

---

# Commit Checklist

Before every commit:

- Repository clean
- Approved scope completed
- Documentation updated
- Tests executed (where applicable)
- No temporary code
- No debug logs
- No TODOs that block functionality

---

# Definition of a Good Git History

A good Git history should allow another engineer to understand:

- What changed
- Why it changed
- When it changed

without reading the entire codebase.

---

# Summary

Git is part of engineering.

Every commit should:

- Be intentional
- Be reviewable
- Be complete
- Be traceable
- Respect the approved implementation plan

The Git history should be as maintainable as the source code itself.