# Minimum Viable Product (MVP)

**Document Version:** 1.0  
**Status:** Approved  
**Last Updated:** 14/07/2026

---

# Purpose

This document defines the minimum feature set required for the first production-ready release of the Kirana Commerce System.

The MVP focuses on solving the core business problem without introducing unnecessary complexity.

---

# MVP Goal

Digitize the existing WhatsApp/manual grocery ordering workflow into a structured web application that enables customers to place orders and administrators to manage products, orders, deliveries, and payments efficiently.

Version 1 is delivered as one responsive Next.js application. Customers, administrators, delivery partners, and super administrators all use the same application, with access controlled by authentication and role-based permissions.

---

# Target Users

The MVP supports the following user roles:

- Customer
- Administrator
- Delivery Partner
- Super Administrator

---

# Business Scope

Current Scope

- Single Store

Architecture

- Multi-store Ready

---

# Customer Features

The MVP includes:

## Product Browsing

- View products
- View categories
- View variants
- Product images
- Product availability

---

## Search

- English search
- Telugu transliteration search
- Telugu script search

---

## Shopping Cart

- Add items
- Remove items
- Update quantities
- Item notes
- Variant selection

---

## Checkout

- Delivery
- Store Pickup
- Address selection
- Address creation
- Order notes

---

## Orders

- Place orders
- View order history
- View order details
- View order status

---

# Administrator Features

## Dashboard

- Dashboard overview
- Pending orders
- Pending deliveries
- Statistics

---

## Product Management

- Create product
- Edit product
- Hide product
- Archive product
- Product variants
- Categories

---

## Order Management

- View all orders
- Filter orders
- Search orders
- Update status
- Manual orders

---

## Delivery Management

- Assign delivery partner
- Reassign delivery
- Delivery dashboard

---

## Customer Management

- View customers
- Customer details
- Order history

---

## Billing

- Delivery charges
- Discounts
- Manual adjustments

---

## Payment Verification

- Payment proof
- Payment status
- Verification

---

# Delivery Partner Features

- Assigned deliveries
- Customer details
- Navigation
- Delivery updates
- Payment collection
- Delivery completion

---

# Super Administrator Features

- Global settings
- Store management
- Administrator management
- Language configuration
- Upload configuration
- Platform monitoring

---

# Image Management

The MVP includes:

- Upload
- Compression
- Thumbnail generation
- WebP conversion

---

# Analytics

Basic analytics only.

Examples:

- Orders
- Revenue
- Delivery
- Payment methods

---

# Authentication

Customer

- Phone-based identification
- Silent account creation

Administrative Users

- Secure authentication
- Role-based authorization

---

# Languages

The MVP supports:

- English
- Telugu

---

# Performance Goals

The MVP should:

- Load quickly
- Work well on mobile
- Handle moderate internet speeds
- Provide responsive interactions

---

# Out of Scope

The following features are intentionally excluded from Version 1.0.

## AI

- Product recommendations
- Personalized suggestions
- AI chat assistant

---

## Logistics

- Live GPS tracking
- Route optimization
- Fleet management

---

## Commerce

- Coupons
- Loyalty points
- Gift cards
- Wallet
- Subscription orders

---

## Inventory

- Warehouse management
- Automatic inventory synchronization
- Purchase management

---

## ERP

- Accounting
- Payroll
- Supplier management

---

## Marketplace

- Multiple stores for customers
- Store discovery
- Store comparison

---

# MVP Success Criteria

The MVP will be considered successful when:

- Customers can place complete grocery orders digitally.
- Administrators can manage products and orders efficiently.
- Delivery partners can complete assigned deliveries.
- Payments can be tracked and verified.
- The complete ordering workflow functions without relying on WhatsApp.

---

# Future Versions

Future releases may include:

- Multi-store support
- Coupons
- Loyalty system
- AI recommendations
- WhatsApp integration
- Inventory automation
- Advanced analytics
- Multiple payment gateways
- Android application using Capacitor with the same codebase

These features are outside the scope of Version 1.0.

Android is not part of the MVP.