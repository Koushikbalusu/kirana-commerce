# Business Rules

**Document Version:** 1.0  
**Status:** Approved  
**Last Updated:** YYYY-MM-DD

---

# Purpose

This document defines the business rules that govern how the Kirana Commerce System operates.

Unlike functional requirements, these rules describe the business logic that must always be enforced regardless of implementation.

Every feature developed in this project must comply with these rules.

---

# General Business Principles

## BR-001

The application must support the existing kirana store workflow rather than forcing a new business process.

---

## BR-002

The platform should prioritize simplicity for customers while providing powerful management capabilities for administrators.

---

## BR-003

All prices shown to customers must always represent the latest configured selling price.

Historical orders must preserve historical prices.

---

## BR-004

Every completed order must remain immutable except through authorized administrative actions.

---

## BR-005

All important business actions must be auditable.

Examples:

- Price changes
- Order cancellation
- Payment verification
- Delivery reassignment
- Product deletion

---

# User Rules

## BR-010

A customer may place orders without creating a traditional username/password account.

---

## BR-011

Customers are identified primarily using their phone number.

---

## BR-012

Returning customers should automatically receive their previously saved information after phone verification (or configured authentication flow).

---

## BR-013

Administrators, Delivery Partners and Super Administrators must authenticate securely before accessing the system.

---

# Product Rules

## BR-020

Every product belongs to one category.

Subcategories are optional.

---

## BR-021

Products may have multiple variants.

Example:

Rice

- 1 kg
- 5 kg
- 10 kg

---

## BR-022

Products without variants should remain fully supported.

---

## BR-023

Products may be sold as:

- Packaged
- Loose

---

## BR-024

Loose products support configurable quantity increments.

Examples:

250 g

500 g

750 g

1 kg

---

## BR-025

Administrators may update product prices at any time.

Price updates affect future orders only.

---

## BR-026

Products can exist in one of three availability states:

- In Stock
- Out of Stock
- Hidden

Hidden products are never shown to customers.

---

## BR-027

Deleting products should be avoided.

Products should preferably be hidden or archived.

---

# Category Rules

## BR-030

Categories may contain subcategories.

---

## BR-031

Products belong to exactly one category.

---

## BR-032

Categories cannot be deleted while products are assigned to them.

---

# Search Rules

## BR-040

Customers may search using:

- English
- Telugu Transliteration
- Telugu Script

---

## BR-041

Search should tolerate spelling mistakes whenever technically feasible.

---

## BR-042

Hidden products must never appear in search results.

---

# Cart Rules

## BR-050

Only available products may be added to the cart.

---

## BR-051

Customers may update quantities before placing an order.

---

## BR-052

Item notes are optional.

---

## BR-053

Cart totals must always be recalculated using current prices.

---

# Address Rules

## BR-060

Customers may maintain multiple addresses.

---

## BR-061

Each order references exactly one delivery address.

---

## BR-062

Addresses may contain optional landmarks and notes.

---

# Order Rules

## BR-070

Orders cannot exist without at least one product.

---

## BR-071

Each order belongs to exactly one customer.

---

## BR-072

Each order is either:

- Home Delivery
- Store Pickup

Never both.

---

## BR-073

Completed orders cannot return to previous statuses.

Status transitions must always move forward unless overridden by an administrator.

---

## BR-074

Administrators may manually create orders.

---

## BR-075

Order prices remain fixed after confirmation unless manually overridden.

---

# Delivery Rules

## BR-080

Only delivery orders may be assigned to delivery partners.

---

## BR-081

Pickup orders never require delivery assignment.

---

## BR-082

A delivery partner can only view assigned deliveries.

---

## BR-083

A delivery partner cannot modify product or billing information.

---

## BR-084

Administrators may reassign deliveries.

---

# Payment Rules

## BR-090

Supported payment modes:

- Cash
- UPI
- Bank Transfer

---

## BR-091

Payment status:

- Pending
- Paid

---

## BR-092

Payment proof may contain multiple images.

---

## BR-093

Payment verification can only be performed by authorized administrators.

---

## BR-094

Cash payments may optionally include proof images.

---

# Billing Rules

## BR-100

The final bill may include:

- Product Total
- Delivery Charges
- Bag Charges
- Discounts

---

## BR-101

Administrators may override totals when necessary.

Every override should be auditable.

---

## BR-102

Discounts may be:

- Item Level
- Order Level

---

# Delivery Charge Rules

## BR-110

Delivery charges may depend on:

- Distance
- Manual Rules
- Future configurable policies

---

## BR-111

Store Pickup never includes delivery charges.

---

# Image Rules

## BR-120

Uploaded images should be automatically optimized before storage.

---

## BR-121

Original uploads should not be exposed directly to customers unless explicitly required.

---

# Security Rules

## BR-130

Only authorized users may access administrative functionality.

---

## BR-131

Every API request must be authenticated where required.

---

## BR-132

User permissions must be enforced on the server.

Never rely solely on frontend restrictions.

---

# Audit Rules

## BR-140

Important business operations should be traceable.

Examples include:

- Product updates
- Price changes
- Order edits
- Payment verification
- Delivery assignment

---

# Future Business Rules

Future modules should follow the same principles defined in this document.

Business rules must remain independent of implementation details and should evolve only when business requirements change.