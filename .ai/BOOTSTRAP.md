# AI Bootstrap Procedure

**Document Version:** 1.0  
**Status:** Approved  
**Priority:** Highest (Session Startup)

---

# Purpose

This document defines the mandatory startup sequence for every AI session.

Before answering questions, proposing changes, writing code, or modifying documentation, the AI must execute this bootstrap procedure.

The objective is to understand the current repository state instead of relying on previous conversations or assumptions.

---

# Golden Rule

Never assume.

Always verify.

The repository is the only trusted source of truth.

---

# Session Startup Workflow

Every new session must follow this sequence.

```
START

↓

Repository Discovery

↓

Read Specifications

↓

Read AI Rules

↓

Analyze Current Code

↓

Determine Project State

↓

Identify Current Task

↓

Generate Implementation Plan

↓

WAIT FOR APPROVAL

↓

Implementation
```

No step may be skipped.

---

# Step 1 — Repository Discovery

Understand the repository structure.

Identify:

- Applications
- Packages
- Documentation
- Specifications
- AI configuration
- Existing source code
- Tests
- Configuration files

Never assume a previous structure.

---

# Step 2 — Read Specifications

Read the complete specifications folder.

Minimum documents:

- vision.md
- business-rules.md
- user-roles.md
- functional-requirements.md
- non-functional-requirements.md
- tech-stack.md
- acceptance-criteria.md
- mvp.md
- future-features.md
- glossary.md
- requirements.md

These documents define the business.

---

# Step 3 — Read AI Instructions

Read every document inside:

.ai/

Including:

- ENGINEERING_CONSTITUTION.md
- AGENTS.md
- BOOTSTRAP.md
- WORKFLOW.md
- CODING_STANDARDS.md
- DOCUMENTATION_RULES.md
- GIT_WORKFLOW.md
- QUALITY_GATES.md
- SYSTEM_PROMPT.md

These documents define engineering behavior.

---

# Step 4 — Analyze Existing Code

Analyze the current implementation.

Determine:

- Completed modules
- Partial implementations
- Existing architecture
- Folder organization
- Components
- APIs
- Database
- Authentication
- UI
- Utilities

Never duplicate existing work.

Always reuse first.

---

# Step 5 — Determine Project Status

Determine:

Current Phase

Current Progress

Completed Features

Incomplete Features

Blocked Work

Technical Debt

Known Risks

Open Questions

Current Branch (if available)

---

# Step 6 — Understand User Request

Determine:

What the user wants.

Classify the request.

Examples:

Architecture

Planning

Feature

Bug Fix

Refactoring

Documentation

Testing

Review

Deployment

Database

---

# Step 7 — Select Active Agent

Choose the primary engineering role.

Examples:

Planning Agent

Architecture Agent

Software Engineer

Database Engineer

Documentation Engineer

Code Reviewer

QA Engineer

---

# Step 8 — Repository Impact Analysis

Before implementation determine:

Which specifications apply?

Which modules change?

Which files change?

Will documentation change?

Will tests change?

Does Git need a new commit?

Does approval already exist?

---

# Step 9 — Produce Implementation Plan

Never immediately write code.

Always generate:

## Repository Status

...

## Relevant Specifications

...

## Current Implementation

...

## Dependencies

...

## Files to Modify

...

## Risks

...

## Step-by-Step Plan

...

## Estimated Scope

...

End with:

**Waiting for approval.**

---

# Step 10 — Wait

Do not begin implementation until approval is received.

Approval examples:

- Proceed
- Approved
- Implement
- Go ahead
- Continue

Without approval:

Remain in planning mode.

---

# Exception

Small clarification questions that do not modify the repository may be answered immediately.

Everything else follows the bootstrap process.

---

# Repository Synchronization

During implementation continuously verify:

- Specifications remain valid.
- Documentation remains synchronized.
- Architecture remains unchanged.
- Existing code remains consistent.

---

# Session Completion

Before ending the session:

Verify:

- Documentation updated.
- Project state updated.
- Git workflow followed.
- Quality gates passed.

---

# Summary

Every session follows this lifecycle:

Repository

↓

Specifications

↓

AI Rules

↓

Current Code

↓

Project Analysis

↓

Planning

↓

Approval

↓

Implementation

↓

Validation

↓

Documentation

↓

Git

↓

Complete

This startup sequence is mandatory for every AI session.
