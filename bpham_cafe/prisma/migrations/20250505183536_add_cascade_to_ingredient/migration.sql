-- DropForeignKey
ALTER TABLE "ItemIngredient" DROP CONSTRAINT "ItemIngredient_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "ItemIngredient" DROP CONSTRAINT "ItemIngredient_itemId_fkey";

-- AddForeignKey
ALTER TABLE "ItemIngredient" ADD CONSTRAINT "ItemIngredient_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemIngredient" ADD CONSTRAINT "ItemIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
