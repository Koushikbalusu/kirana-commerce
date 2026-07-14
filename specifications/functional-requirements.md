# Functional Requirements

**Document Version:** 1.0  
**Status:** Approved  
**Last Updated:** 14/07/2026

---

# Purpose

This document defines the functional requirements of the Kirana Commerce System.

Functional requirements describe **what the system must do** from the perspective of users and business operations.

Implementation details are intentionally excluded.

---

# FR-001 Customer Management

The system shall allow customers to:

- Browse products without mandatory account creation.
- Be identified primarily using a phone number.
- Automatically retrieve previously saved customer information.
- Manage multiple delivery addresses.
- View previous orders.
- Place delivery and pickup orders.

---

# FR-002 Authentication

The system shall support multiple authentication flows based on user roles.

Customer

- Low-friction authentication
- Silent account creation
- Phone number identification

Administrative Users

- Secure login
- Session management
- Role-based authorization

---

# FR-003 Product Catalog

The system shall allow administrators to:

- Create products
- Edit products
- Archive products
- Hide products
- Restore archived products

Products shall support:

- Multiple images
- Categories
- Optional subcategories
- Multiple variants
- Loose quantity sales
- Packaged products
- Availability status

---

# FR-004 Product Variants

Products may contain one or more variants.

Examples:

Rice

- 1 kg
- 5 kg
- 10 kg

Oil

- 500 ml
- 1 L
- 5 L

Products without variants shall also be supported.

---

# FR-005 Quantity System

The system shall support configurable quantity rules.

Each product may define:

- Unit
- Minimum quantity
- Quantity step
- Optional maximum quantity

Supported units include:

- KG
- Gram
- Liter
- ml
- Piece
- Packet
- Sack
- Dozen
- Custom

---

# FR-006 Categories

The system shall support:

- Categories
- Optional subcategories
- Product grouping
- Product filtering

---

# FR-007 Search

The search system shall support:

- English search
- Telugu transliteration search
- Telugu script search
- Typo tolerance
- Partial matching
- Fast search

Search results shall never include hidden products.

---

# FR-008 Shopping Cart

Customers shall be able to:

- Add items
- Remove items
- Update quantities
- Select variants
- Add item notes
- Review pricing
- Choose delivery or pickup

The cart shall automatically calculate totals.

---

# FR-009 Address Management

Customers shall be able to:

- Add addresses
- Edit addresses
- Delete addresses
- Select current location
- Choose location on map
- Enter address manually

Address fields include:

- House Number
- Area
- Landmark
- Notes

---

# FR-010 Orders

The system shall support:

- Delivery orders
- Pickup orders

Order lifecycle includes:

Placed

↓

Confirmed

↓

Preparing

↓

Ready

↓

Out for Delivery / Ready for Pickup

↓

Completed

Orders shall maintain complete history.

---

# FR-011 Delivery Management

Administrators shall be able to:

- View pending deliveries
- Assign delivery partners
- Reassign deliveries
- View delivery locations
- Track delivery progress

Delivery partners shall:

- View assigned deliveries
- Update delivery status
- Navigate to customer
- Record payment collection

---

# FR-012 Billing

The billing system shall support:

- Product total
- Delivery charge
- Bag charge
- Discounts
- Manual adjustments
- Billing notes

The final total shall always be calculated automatically.

---

# FR-013 Payments

Supported payment methods:

- Cash
- UPI
- Bank Transfer

The system shall support:

- Payment status
- Payment proof uploads
- Multiple proof images
- Payment verification

---

# FR-014 Image Management

The system shall automatically:

- Compress images
- Resize images
- Convert images to WebP where appropriate
- Generate thumbnails
- Optimize images for mobile devices

---

# FR-015 Analytics

Administrators shall be able to view:

- Total orders
- Pending orders
- Delivery statistics
- Pickup statistics
- Payment statistics
- Customer statistics

The dashboard shall support filtering.

---

# FR-016 Administration

Administrators shall manage:

- Products
- Categories
- Customers
- Orders
- Deliveries
- Payments
- Discounts
- Analytics

---

# FR-017 Super Administration

Super Administrators shall manage:

- Stores
- Administrators
- Global settings
- Language configuration
- Upload configuration
- Platform monitoring

Although the architecture supports multiple stores, the MVP operates with a single active store.

---

# FR-018 Multilingual Support

The application shall support:

- English
- Telugu

Language support applies to:

- Customer interface
- Administrator interface
- Delivery Partner interface
- Super Administrator interface

All of these interfaces exist within the same platform and are exposed according to authenticated user roles and permissions.

Products shall support:

- English names
- Telugu transliteration
- Telugu script

---

# FR-019 Notifications

The system shall be designed so that future notification channels (SMS, WhatsApp, Email, Push Notifications) can be integrated without major architectural changes.

Notification implementation is outside the MVP scope.

---

# FR-020 Error Handling

The application shall provide:

- User-friendly error messages
- Validation feedback
- Graceful failure handling
- Consistent error responses

Internal system errors shall never expose sensitive implementation details.

---

# FR-021 Audit Logging

The system shall maintain audit information for important administrative actions, including:

- Product modifications
- Order updates
- Price changes
- Payment verification
- Delivery assignments

---

# FR-022 Future Extensibility

The architecture shall support future expansion including:

- Multiple stores
- Additional languages
- Loyalty programs
- Inventory management
- Additional payment gateways
- Coupons
- Promotions

These capabilities are not part of the MVP but should not require architectural redesign.
