import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const allIngredients = await prisma.ingredient.findMany({
      orderBy: { name: "asc" },
    });

    return new Response(
      JSON.stringify({
        message: "Ingredients founded successfully",
        categories: allIngredients,
      })
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Unable to find ingredients",
        error: error.message,
      })
    );
  }
}
