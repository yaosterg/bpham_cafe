import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.json();
    console.log("Received form data:", formData);

    const newMenuItem = await prisma.item.create({
      data: {
        name: formData.name,
        description: formData.description,
        price: new Prisma.Decimal(formData.price),
        imageURL: formData.imageURL,
        menuStatus: formData.status,
        categoryId: formData.categoryId,
        options: formData.options,
        ingredients: {
          create: formData.ingredients.map((ingredient) => ({
            ingredientId: ingredient.ingredientId,
            qty: ingredient.quantity,
          })),
        },
      },
    });
    console.log("New menu item created:", newMenuItem);

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
