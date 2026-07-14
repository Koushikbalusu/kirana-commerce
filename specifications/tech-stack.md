# Technology Stack

**Document Version:** 1.0  
**Status:** Approved  
**Last Updated:** YYYY-MM-DD

---

# Purpose

This document defines the approved technology stack for the Kirana Commerce System.

All implementation should follow these decisions unless an architectural decision (ADR) explicitly approves a change.

---

# Architecture

Current Architecture

- Monorepo
- Single Next.js Application
- Modular Architecture
- Documentation First
- AI-Assisted Development

Package Manager

- npm

Project Structure

- apps/web

Current Business Scope

- Single Store

Architecture Capability

- Multi-Store Ready

Deployment Target

- Responsive Web Application

Route Organization

- Route Groups for Customer, Administrator, Delivery Partner, and Super Administrator interfaces within the same application

---

# Frontend

Framework

- Next.js 15

Language

- TypeScript

Routing

- App Router
- Route Groups for role-based interfaces

Rendering

- Server Components by default
- Client Components only when necessary

Styling

- Tailwind CSS v4

UI Components

- Radix UI

Icons

- Lucide React

Animations

- Motion (Framer Motion)

State Management

- Zustand

Forms

- React Hook Form

Validation

- Zod

Tables

- TanStack Table

---

# Backend

Backend Framework

- Next.js Route Handlers
- Next.js Server Actions

Authentication

- Better Auth

Authorization

- Role Based Access Control (RBAC)

API Style

- REST where required
- Server Actions preferred for internal operations

Deployment Model

- One application deployment

---

# Database

Database

- PostgreSQL

Provider

- Neon

ORM

- Drizzle ORM

Migration Tool

- Drizzle Kit

Database Design Principles

- UUID Primary Keys
- Soft Deletes where appropriate
- Audit Fields
- Proper Indexing
- Foreign Key Constraints

---

# File Storage

Storage Provider

- Bunny Storage

CDN

- Bunny CDN

Image Processing

- Sharp

Supported Formats

- JPEG
- PNG
- WebP

Future Formats

- AVIF

Future Evolution

- Progressive Web App (PWA)
- Android app using Capacitor
- Shared codebase for web and future native-capable experiences

---

# Search

Current Decision

Search implementation is intentionally abstracted.

Candidate Providers

- PostgreSQL Full Text Search
- Typesense
- Meilisearch

Final implementation will be selected during Product Catalog development.

The application architecture must not depend on any specific search provider.

---

# Maps

Provider

- Ola Maps

Fallback

- OpenStreetMap

Map Library

- Leaflet

Capabilities

- Address Selection
- Delivery Navigation
- Delivery Area Visualization

---

# Cache

Provider

- Upstash Redis

Primary Uses

- Caching
- Rate Limiting
- Session Optimization
- Frequently Accessed Data

---

# Validation

Library

- Zod

Validation Principles

- Shared validation
- Server-side validation
- Client-side validation
- Type-safe schemas

---

# Internationalization

Primary Languages

- English
- Telugu

Future Support

- Additional Languages

Requirements

- No hardcoded user-facing strings
- Translation-based UI

---

# Image Management

Features

- Compression
- Resizing
- Thumbnail Generation
- Format Optimization
- CDN Delivery

---

# Logging

Development

- Console Logging

Production

- Structured Logging

Monitoring

- Sentry

---

# Analytics

Current Scope

Administrative analytics only.

Future integrations may include external analytics platforms.

---

# Testing

Planned

- Unit Testing
- Integration Testing
- End-to-End Testing

---

# Deployment

Platform

- Vercel

Database

- Neon

Storage

- Bunny Storage

CDN

- Bunny CDN

Environment Management

- Environment Variables

---

# Development Tools

Version Control

- Git

Package Manager

- npm

Code Formatting

- Prettier

Linting

- ESLint

Type Checking

- TypeScript

---

# AI Development

Primary AI

- Gemini CLI

Responsibilities

- Code Generation
- Refactoring
- Documentation
- Testing Assistance
- Architecture Assistance

Project knowledge must always come from the repository rather than previous chat history.

---

# Technology Evaluation Policy

Technology changes should occur only when one or more of the following conditions are met:

- Significant performance improvement
- Better maintainability
- Lower operational cost
- Improved developer experience
- Long-term sustainability

Technology should never be replaced solely because a newer option exists.

---

# Guiding Principle

The technology stack should remain stable throughout development.

Stability, maintainability, and long-term reliability take priority over adopting new technologies without clear benefit.