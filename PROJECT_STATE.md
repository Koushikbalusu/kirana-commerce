# Project State

**Current Phase:** Phase 14 — Search & Discovery Completed

## Completed Work

- Phase 1: Developer Tooling Setup
  - Initialized root `package.json` for npm workspaces.
  - Added `.npmrc` to enforce strict dependency rules.
  - Configured Prettier and `prettier-plugin-tailwindcss` for monorepo-wide code formatting.
  - Added `.editorconfig` and `.vscode` settings for consistent developer environments.
  - Installed Husky and configured lint-staged to format code on pre-commit.

- Phase 2: Core Foundation
  - Scaffolded shared packages (`config`, `constants`, `types`, `ui`, `utils`, `validation`).
  - Created root `tsconfig.base.json` to enforce strict TypeScript configuration.
  - Configured `tsconfig.json` inheritance across all packages.
  - Linked all `@kirana/*` packages securely as dependencies in `apps/web`.
  - Established initial barrel files (`src/index.ts`) for public API exports.

- Phase 3: Design System
  - Implemented the UI package folder structure.
  - Built the Tailwind v4 Master Theme architecture.
  - Implemented Geist typography and 15 foundational UI components via Radix primitives.
  - Integrated `next-themes` and a centralized `ThemeProvider`.
  - Consolidated Git ignores and enforced monorepo git hygiene.

- Phase 4: Environment & Configuration
  - Restructured `packages/config` into logical layers (`app/`, `env/`, `runtime/`, `feature-flags/`, `schemas/`, `constants/`).
  - Installed and configured Zod and `@t3-oss/env-nextjs` for type-safe, validated environment parsing.
  - Implemented explicit client (`NEXT_PUBLIC_`) and server (`NODE_ENV`) configuration separation.
  - Initialized the root `.env.example` following the Configuration Categories policy.
  - Exposed a completely type-safe singleton configuration API.

- Phase 5: Database Infrastructure
  - Scaffolded the `@kirana/database` package as the sole persistence abstraction.
  - Installed `drizzle-orm`, `drizzle-kit`, and `@neondatabase/serverless`.
  - Established strict structure (`client/`, `config/`, `schema/`, `migrations/`, `repositories/`, `views/`, `transactions/`, `seeds/`, `utils/`).
  - Configured Drizzle Kit (`drizzle.config.ts`) pointing to `schema/index.ts`.
  - Established a singleton database client optimized for Neon Serverless.
  - Created a robust transaction propagation wrapper.
  - Restructured `schema/` into `tables/`, `relations/`, and `enums/`.
  - Consumed `DATABASE_URL` safely via `@kirana/config`.

- Phase 6: Authentication & Authorization (RBAC)
  - Scaffolded `@kirana/auth` and integrated Auth.js.
  - Extended `@kirana/database` with Users, Accounts, Sessions, Roles, and Permissions schemas mapping exactly to the Auth.js Drizzle Adapter.
  - Implemented Argon2id password hashing and database-backed sessions.
  - Wired Next.js 16 Edge proxy interception securely to `@kirana/auth`.
  - Enforced one-way dependency layers across packages.
  - Built generic RBAC evaluators (`hasPermission`, `getCurrentUser`) and session extraction layers.

- Phase 7: Product Catalog
  - Designed and scaffolding the `@kirana/catalog` package utilizing a feature-first Vertical Slice architecture (Product, Category, Brand, Variant).
  - Designed and extended `@kirana/database` with `products`, `categories`, `brands`, `product_images`, `product_variants`, `product_attributes`, and `attribute_values` tables.
  - Ensured no inventory or pricing fields leaked into the Catalog.
  - Set up internal Repositories, DTO mappings, Zod input validation, and business logic Services.
  - Implemented deterministic Slug generation.
  - Prepared generic `ProductCreated`, `ProductPublished`, etc., events for future Search readiness.
  - Maintained a strict Public API (Services, DTOs, and Validators only).

- Phase 8: Inventory Management
  - Scaffolded the `@kirana/inventory` package using the Vertical Slice pattern (`inventory`, `warehouse`, `reservation`, `movement`, `shared`).
  - Modeled `warehouses`, `inventory`, `reservations`, `inventory_movements`, `stock_adjustments`, and `transfers` in `@kirana/database`.
  - Implemented generic Reservation boundaries (owner agnostic).
  - Ensured all stock mutations write to an immutable `InventoryMovement` ledger describing business events (`RECEIVED`, `SHIPPED`, `RESERVED`, etc.).
  - Implemented strict Pessimistic Locking (`SELECT ... FOR UPDATE`) in `InventoryRepository` inside Service-managed transaction boundaries.
  - Prepared `InventoryReserved`, `InventoryReceived`, and other asynchronous Domain Event definitions for future scalability.
  - Excluded physical Catalog, Orders, Pricing dependencies entirely from the domain.

- Phase 9: Pricing & Promotions
  - Scaffolded the `@kirana/pricing` package utilizing Vertical Slice (`price`, `promotion`, `coupon`, `tax`, `currency`).
  - Modeled `currencies`, `prices`, `price_history`, `promotions`, `promotion_conditions`, `promotion_actions`, `coupons`, and `tax_categories` in `@kirana/database`.
  - Represented the `Money` concept internally (forcing integer precision calculations in smallest units).
  - Designed a deterministic Price Resolution Pipeline that sequentially evaluates Base Price → Promotions → Coupons → Tax → Final Price.
  - Structured immutable Append-Only `PriceHistory`.
  - Implemented extensible condition-based rule engines for Promotions, leaving Prices themselves immutable.
  - Outlined asynchronous Domain Event definitions for `PriceChanged`, `CouponRedeemed`, etc., preparing the ground for decoupled consumer integrations (Cart/Orders).

- Phase 10: Shopping Cart
  - Scaffolded the `@kirana/cart` package utilizing Vertical Slice (`cart`, `cart-item`, `cart-session`).
  - Modeled `carts`, `cart_items`, and `cart_sessions` in `@kirana/database` ensuring purchase intent tracking separated from pricing/inventory.
  - Enforced a deterministic Guest Merge Algorithm preserving cart contents across anonymous-to-authenticated transitions.
  - Configured `CartValidationResult` (purchase feasibility) and `CartSnapshot` (financial view) as dynamically calculated runtime concepts.
  - Guaranteed `cart_items` store strictly `variant_id` and `quantity` with no duplicated catalog definitions.
  - Excluded Inventory reservation logics, preparing validation structures to be evaluated against actual stock states during the impending Checkout Phase.
  - Prepared event definitions like `CartMerged`, `ItemAdded`, and `CouponApplied`.

- Phase 11: Orders
  - Scaffolded the `@kirana/orders` package utilizing Vertical Slice (`order`, `order-item`, `checkout-session`, `fulfillment`).
  - Modeled `orders`, `order_items`, `checkout_sessions`, `order_status_history`, and `fulfillments` in `@kirana/database` as immutable ledgers.
  - Implemented `CheckoutSession` as the authoritative orchestrator preventing duplicate orders through idempotency keys.
  - Constructed `OrderItem` to permanently snapshot external domain references (product names, pricing deductions) preserving historical accuracy.
  - Separated financial status (e.g., `UNPAID`, `PAID`) from fulfillment status (e.g., `UNFULFILLED`, `SHIPPED`) into independent tracked state machines.
  - Persisted JSONB snapshots inside the Order entity ensuring customer profile edits or address changes never retroactively alter historical invoices.
  - Maintained Service layer encapsulation executing complex transaction blocks directly against Repositories.

- Phase 12: Payments
  - Scaffolded the `@kirana/payments` package utilizing Vertical Slice (`payment`, `payment-intent`, `payment-attempt`, `refund`, `provider`, `webhook`, `reconciliation`).
  - Modeled `payment_providers`, `provider_configurations`, `payment_intents`, `payment_attempts`, `payments`, `refunds`, and `webhook_events` in `@kirana/database`.
  - Implemented `PaymentAttempt` as a first-class aggregate to track individual provider retries and isolated provider status from internal state.
  - Enforced strict idempotency constraints via unique `idempotencyKey` tracking.
  - Separated Refund logic into an independent aggregate preventing mutations on finalized payment ledgers.
  - Established the `ProviderAdapter` pattern to guarantee abstraction from third-party SDKs.
  - Ensured precision by structuring all monetary operations strictly on integers.

- Phase 13: Shipping & Fulfillment
  - Scaffolded the `@kirana/shipping` package utilizing Vertical Slice (`shipment`, `shipment-attempt`, `shipment-item`, `carrier`, `tracking`, `label`, `address`, `shared`).
  - Modeled `carriers`, `carrier_configurations`, `shipments`, `shipment_attempts`, `shipment_items`, `tracking_events`, `shipping_labels`, `shipment_exceptions`, `proof_of_deliveries`, and `carrier_webhooks` in `@kirana/database`.
  - Transitioned to a Lightweight Fulfillment aggregate, decoupling shipments from strict 1:1 order relationships (supporting future split shipments).
  - Explicitly designed `ShipmentAttempt` tracking to capture failed carrier handovers securely.
  - Structured strictly append-only `tracking_events` architecture preventing history overrides.
  - Designed future-ready aggregates for Proof of Delivery and Exception handling.
  - Constructed abstract Carrier Adapter definitions preparing for integration with BlueDart, Delhivery, FedEx without polluting business layers.
  - Permanently snapshotted shipping addresses upon shipment creation avoiding retroactive address mutations from customer profile edits.

- Phase 14: Search & Discovery
  - Scaffolded the `@kirana/search` package utilizing Vertical Slice architecture isolating independent engines (`query-engine`, `index-engine`, `search`, `autocomplete`, `facet`, `ranking`, `spell-correction`, `synonyms`, `merchandising`, `cache`, `analytics`).
  - Modeled `search_documents`, `search_indices`, `search_suggestions`, `search_synonyms`, `search_analytics`, and `search_events` in `@kirana/database`.
  - Defined rigid, immutable Value Objects `SearchQuery` and `SearchResult` enforcing isolation from upstream HTTP contexts and downstream provider SDKs.
  - Explicitly divided the domain into a latency-optimized stateless Query Engine and a throughput-optimized asynchronous Indexing Engine.
  - Abstracted external search implementations via `SearchProviderAdapter` supporting zero-friction migration between Postgres FTS, Typesense, Elasticsearch, and Algolia.
  - Engineered the logical Normalization Pipeline segregating spell correction, synonym expansion, tokenization, and stop-word removal into distinct execution phases.
  - Scaffolding future-ready architecture for advanced vector-based hybrid search, personalized RAG implementations, and campaign-driven merchandising logic.

## Next Phase

- TBD
