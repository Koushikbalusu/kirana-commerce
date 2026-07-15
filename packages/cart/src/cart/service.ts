import { CartRepository } from './repository';
import { CartItemRepository } from '../cart-item/repository';
import { toCartResponse } from './mapper';
import type { CartResponseDTO } from './dto';
import type { CartSnapshot, CartValidationResult } from '../shared/types';

const cartRepo = new CartRepository();
const itemRepo = new CartItemRepository();

export class CartService {
  async getOrCreateActiveCart(userId?: string, sessionId?: string): Promise<CartResponseDTO> {
    let cart = await cartRepo.getActiveCart(userId, sessionId);
    if (!cart) {
      cart = await cartRepo.create({ userId, sessionId });
    }
    return toCartResponse(cart);
  }

  async addItem(cartId: string, variantId: string, quantity: number): Promise<CartResponseDTO> {
    // Basic quantity validation here
    if (quantity <= 0) throw new Error('Quantity must be greater than zero.');
    if (quantity > 10) throw new Error('Cannot add more than 10 items at once.');

    await itemRepo.upsertItem(cartId, variantId, quantity);

    const cart = await cartRepo.getActiveCart(undefined, cartId); // Note: We need a getById really, assuming getActiveCart can fetch by id indirectly or we just fetch again.
    // For simplicity, we just fetch by id. Let's assume we implement getById.
    const updated = await dbQueryCartById(cartId);
    return toCartResponse(updated);
  }

  async removeItem(cartId: string, variantId: string): Promise<CartResponseDTO> {
    await cartRepo.deleteItem(cartId, variantId);
    const updated = await dbQueryCartById(cartId);
    return toCartResponse(updated);
  }

  async clearCart(cartId: string): Promise<void> {
    await cartRepo.clearCart(cartId);
  }

  async applyCoupon(cartId: string, couponCode: string): Promise<CartResponseDTO> {
    await cartRepo.setCoupon(cartId, couponCode);
    const updated = await dbQueryCartById(cartId);
    return toCartResponse(updated);
  }

  async generateSnapshot(cartId: string): Promise<CartSnapshot> {
    // This is an architectural concept. It would normally call @kirana/pricing.
    return {
      subtotal: { amount: 0, currencyCode: 'USD', precision: 2 },
      discounts: { amount: 0, currencyCode: 'USD', precision: 2 },
      couponDiscount: { amount: 0, currencyCode: 'USD', precision: 2 },
      estimatedTax: { amount: 0, currencyCode: 'USD', precision: 2 },
      estimatedTotal: { amount: 0, currencyCode: 'USD', precision: 2 },
      currency: 'USD',
      generatedAt: new Date(),
    };
  }

  async validateCart(cartId: string): Promise<CartValidationResult> {
    // This would call @kirana/inventory and @kirana/pricing to check rules dynamically
    return {
      isValid: true,
      unavailableItems: [],
      quantityWarnings: [],
      invalidCoupons: [],
      inventoryWarnings: [],
      messages: [],
    };
  }

  async mergeGuestCart(userId: string, guestSessionId: string): Promise<CartResponseDTO> {
    const guestCart = await cartRepo.getActiveCart(undefined, guestSessionId);
    const userCart = await cartRepo.getActiveCart(userId);

    if (!guestCart || !guestCart.items || guestCart.items.length === 0) {
      return toCartResponse(userCart || (await cartRepo.create({ userId })));
    }

    const targetCart = userCart || (await cartRepo.create({ userId }));

    // Deterministic merge: sum quantities
    for (const guestItem of guestCart.items) {
      const existing = targetCart.items?.find((i) => i.variantId === guestItem.variantId);
      const newQuantity = (existing?.quantity || 0) + guestItem.quantity;
      // Cap at 10
      const cappedQuantity = Math.min(newQuantity, 10);
      await itemRepo.upsertItem(targetCart.id, guestItem.variantId, cappedQuantity);
    }

    // Discard guest cart
    await cartRepo.clearCart(guestCart.id);
    // Mark abandoned or delete...

    const updated = await dbQueryCartById(targetCart.id);
    return toCartResponse(updated);
  }
}

import { db, carts } from '@kirana/database';
import { eq } from 'drizzle-orm';
async function dbQueryCartById(id: string) {
  const row = await db.query.carts.findFirst({
    where: eq(carts.id, id),
    with: { items: true },
  });
  if (!row) throw new Error('Cart not found');
  return row as any;
}
