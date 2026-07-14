# Glossary

**Document Version:** 1.0  
**Status:** Approved  
**Last Updated:** 14/07/2026

---

# Purpose

This document defines the business and technical terminology used throughout the Kirana Commerce System.

These definitions ensure consistent understanding for developers, designers, administrators, and AI assistants working on the project.

---

# Business Terms

## Kirana Store

A neighborhood grocery store that sells packaged goods, loose goods, household items, and daily essentials.

---

## Customer

A person who browses products and places grocery orders.

---

## Administrator

A store staff member responsible for managing products, orders, deliveries, customers, and payments.

---

## Super Administrator

A platform-level administrator responsible for global configuration, platform management, and administrative users.

---

## Delivery Partner

A user responsible for delivering customer orders and updating delivery status.

---

## Product

An item available for purchase.

Examples:

- Rice
- Oil
- Soap
- Biscuits

---

## Product Variant

Different purchasable versions of the same product.

Examples:

- 250 g
- 500 g
- 1 kg
- 5 kg

---

## Loose Product

Products sold by weight or volume rather than fixed packaging.

Examples:

- Rice
- Dal
- Flour

---

## Packaged Product

Products sold in predefined packages.

Examples:

- Biscuits
- Shampoo
- Cooking Oil Bottle

---

## Category

Primary grouping of products.

Examples:

- Groceries
- Vegetables
- Dairy
- Snacks

---

## Subcategory

Secondary grouping within a category.

Example:

Groceries

↓

Rice

↓

Basmati Rice

---

## Cart

A temporary collection of products selected by a customer before placing an order.

---

## Order

A confirmed purchase request submitted by a customer.

---

## Delivery Order

An order delivered to the customer's address.

---

## Pickup Order

An order collected by the customer from the store.

---

## Payment Proof

One or more uploaded images used to verify a completed payment.

---

## Delivery Assignment

The process of assigning an order to a delivery partner.

---

## Billing Adjustment

A manual modification made by an administrator to the calculated order total.

---

## Delivery Charge

Additional fee charged for home delivery.

---

## Bag Charge

Optional charge for packaging bags.

---

# Technical Terms

## Server Action

A secure server-side function executed by Next.js.

---

## Route Handler

A backend API endpoint implemented using Next.js App Router.

---

## RBAC

Role-Based Access Control.

Determines what actions each user role is permitted to perform.

---

## ORM

Object Relational Mapper.

The project uses Drizzle ORM to communicate with PostgreSQL.

---

## UUID

Universally Unique Identifier.

Used as the primary identifier for business entities.

---

## CDN

Content Delivery Network.

Used for efficient image delivery.

---

## Repository

The complete project workspace including source code, documentation, specifications, AI instructions, and configuration.

---

## MVP

Minimum Viable Product.

The smallest complete version of the application that solves the primary business problem.

---

## AI Assistant

Any AI tool (such as Gemini CLI) that contributes to planning, implementation, documentation, testing, or maintenance of the project.

---

# Naming Conventions

Throughout the project, the following terminology should be used consistently:

Use:

- Customer
- Administrator
- Super Administrator
- Delivery Partner
- Product
- Variant
- Category
- Cart
- Order
- Delivery
- Payment

Avoid introducing alternative names unless required by business needs.

---

# Future Terms

Additional terminology may be added as the platform evolves.

Existing definitions should remain stable to preserve consistency across the project.