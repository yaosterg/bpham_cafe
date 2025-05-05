import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.json();
    console.log("formData", formData);
    const newMenuItem = await prisma.item.create({
      data: {
        name: formData.name,
        description: formData.description,
        price: new Prisma.Decimal(formData.price),
        imageURL: formData.imageURL,
        menuStatus: formData.status,
        categoryId: formData.categoryId,
        ingredients: {
          create: formData.ingredients.map((ingredient) => ({
            ingredientId: ingredient.ingredientId,
          })),
        },
      },
    });
    console.log("new menu item", newMenuItem);

    return new Response(
      JSON.stringify({
        message: "Menu item created successfully",
        item: newMenuItem,
      })
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Unable to create menu item",
        error: error.message,
      })
    );
  }
}
