# Migration: Add Unique Constraint to Cart.customerId

This migration adds a unique constraint to the `customerId` field of the `Cart` table, ensuring each customer can only have one cart.

**Required Steps:**
1. Run `npx prisma migrate dev --name add_cart_customerid_unique` to apply the migration.
2. If you have duplicate carts per customer, clean them up before running the migration.
3. After migration, the backend will use `findUnique` for cart lookup.

**Why:**
- Prevents unique constraint errors on cart creation.
- Guarantees each customer only has one cart.

**Schema change:**
```
model Cart {
  id          Int        @id @default(autoincrement()) @map("cart_id")
  customerId  Int        @unique @map("customer_id")
  ...
}
```
