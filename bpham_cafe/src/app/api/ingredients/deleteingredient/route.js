import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.json();
    const deletedIngredient = await prisma.ingredient.delete({
      where: { id: formData.id },
    });

    return new Response(
      JSON.stringify({
        message: "Ingredient deleted successfully",
        ingredient: deletedIngredient,
      })
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Unable to delete ingredient",
        error: error.message,
      })
    );
  }
}
