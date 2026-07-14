# User Roles

**Document Version:** 1.0  
**Status:** Approved  
**Last Updated:** 14/07/2026

---

# Purpose

This document defines every user role supported by the Kirana Commerce System, along with their responsibilities, permissions, and access boundaries.

All authorization within the application must be based on these role definitions.

---

# Supported Roles

The system currently supports four primary roles:

1. Customer
2. Delivery Partner
3. Administrator
4. Super Administrator

Future roles may be added without affecting the existing permission model.

---

# Customer

## Description

Customers are end users who browse products, place orders, manage their addresses, and view their order history.

Customers should experience the simplest possible workflow.

---

## Primary Responsibilities

- Browse products
- Search products
- Manage cart
- Place orders
- Manage addresses
- Upload payment proof
- View order history
- View order status
- Select delivery or pickup

---

## Customer Permissions

### Products

✅ View Products

✅ Search Products

✅ View Categories

❌ Create Products

❌ Edit Products

❌ Delete Products

---

### Orders

✅ Create Orders

✅ View Own Orders

✅ Cancel Own Order (Before Processing)

❌ View Other Customer Orders

❌ Modify Processed Orders

---

### Cart

✅ Add Items

✅ Remove Items

✅ Update Quantities

---

### Address

✅ Create Address

✅ Edit Own Address

✅ Delete Own Address

---

### Payments

✅ Upload Payment Proof

✅ View Own Payment Status

---

### Analytics

❌ No Access

---

### Administration

❌ No Access

---

# Delivery Partner

## Description

Delivery partners are responsible for completing assigned deliveries.

They have access only to deliveries assigned to them.

---

## Responsibilities

- View Assigned Deliveries
- Navigate to Customer
- Update Delivery Status
- Collect Payments
- Upload Delivery Proof

---

## Delivery Permissions

### Orders

✅ View Assigned Orders

❌ View All Orders

❌ Edit Billing

❌ Edit Products

---

### Customers

✅ View Delivery Customer Details

❌ Edit Customer Information

---

### Payments

✅ Update Payment Collection Status

✅ Upload Payment Proof

❌ Verify Payments

---

### Delivery

✅ Update Delivery Status

✅ Mark Delivered

❌ Assign Deliveries

---

### Administration

❌ No Access

---

# Administrator

## Description

Administrators manage the daily operation of a store.

They have complete access to store resources but cannot modify platform-wide settings.

---

## Responsibilities

- Product Management
- Category Management
- Customer Management
- Order Management
- Delivery Management
- Billing
- Discounts
- Analytics
- Payment Verification

---

## Product Permissions

✅ Create

✅ Edit

✅ Delete (Soft Delete Preferred)

✅ Hide

✅ Restore

---

## Category Permissions

✅ Create

✅ Edit

✅ Delete

---

## Orders

✅ View All Orders

✅ Edit Orders

✅ Cancel Orders

✅ Create Manual Orders

✅ Update Status

---

## Delivery

✅ Assign Delivery Partner

✅ Reassign Delivery

✅ View Delivery Dashboard

---

## Customers

✅ View Customers

✅ Edit Customer Information

---

## Payments

✅ Verify Payment

✅ Override Payment Status

---

## Analytics

✅ View Store Analytics

---

## Configuration

✅ Delivery Rules

✅ Bag Charges

✅ Discounts

✅ Upload Limits (Store Level)

---

## Administration

❌ Cannot Create Super Administrators

❌ Cannot Modify Global Platform Configuration

---

# Super Administrator

## Description

The Super Administrator manages the platform itself rather than the day-to-day operation of a specific store.

Super Administrators inherit every Administrator permission.

---

## Additional Responsibilities

- Platform Administration
- Store Management
- Global Configuration
- Language Configuration
- Admin Management
- Monitoring
- Upload Configuration
- System Maintenance

---

## Platform Permissions

✅ Create Stores

✅ Disable Stores

✅ Manage Administrators

✅ Manage Super Administrators

✅ Configure Global Settings

✅ Configure Languages

✅ Configure Upload Limits

✅ Configure Image Rules

✅ Configure Delivery Rule Templates

✅ System Monitoring

---

## Analytics

✅ Platform-wide Analytics

---

## Security

✅ Manage Administrative Accounts

✅ Manage Role Assignments

---

# Permission Inheritance

Customer

↓

Delivery Partner

(Independent Role)

↓

Administrator

↓

Super Administrator

Super Administrator inherits every Administrator permission.

Customer and Delivery Partner remain independent roles.

---

# Access Rules

## Customer

Access only to their own information.

---

## Delivery Partner

Access only to assigned deliveries.

---

## Administrator

Access only to the store they belong to.

---

## Super Administrator

Platform-wide access.

---

# Authorization Principles

The application must enforce authorization on the server.

Frontend permissions exist only to improve user experience.

Every API endpoint and Server Action must validate permissions before performing business operations.

---

# Future Extensibility

The permission model should allow future roles without major architectural changes.

Possible future roles include:

- Store Manager
- Cashier
- Inventory Manager
- Customer Support
- Auditor
- Regional Administrator

These roles are not part of the current implementation but should remain possible within the authorization architecture.