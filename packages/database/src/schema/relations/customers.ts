import { relations } from 'drizzle-orm';
import { users } from '../tables/users';
import { customerProfiles } from '../tables/customer_profiles';
import { customerAddresses } from '../tables/customer_addresses';
import { addressVersions } from '../tables/address_versions';
import { customerWishlists } from '../tables/customer_wishlists';
import { customerWishlistItems } from '../tables/customer_wishlist_items';

export const userCustomerRelations = relations(users, ({ one, many }) => ({
  profile: one(customerProfiles, {
    fields: [users.id],
    references: [customerProfiles.userId],
  }),
  addresses: many(customerAddresses),
  wishlists: many(customerWishlists),
}));

export const customerAddressRelations = relations(customerAddresses, ({ many }) => ({
  versions: many(addressVersions),
}));

export const addressVersionRelations = relations(addressVersions, ({ one }) => ({
  address: one(customerAddresses, {
    fields: [addressVersions.addressId],
    references: [customerAddresses.id],
  }),
}));

export const customerWishlistRelations = relations(customerWishlists, ({ many }) => ({
  items: many(customerWishlistItems),
}));

export const customerWishlistItemRelations = relations(customerWishlistItems, ({ one }) => ({
  wishlist: one(customerWishlists, {
    fields: [customerWishlistItems.wishlistId],
    references: [customerWishlists.id],
  }),
}));
