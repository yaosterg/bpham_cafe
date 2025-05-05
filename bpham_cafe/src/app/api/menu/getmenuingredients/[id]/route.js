import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const p = await params;
  const id = Number(p.id);

  try {
    const ingredients = await prisma.itemIngredient.findMany({
      where: {
        itemId: id,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Menu items ingredients founded successfully",
        ingredients: ingredients,
      })
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Unable to find menu items ingredient",
        error: error.message,
      })
    );
  }
}
