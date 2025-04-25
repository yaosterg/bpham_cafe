import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.json();
    console.log("Form Data:", formData);

    const newIngredient = await prisma.category.create({
      data: formData,
    });

    return new Response(
      JSON.stringify({
        message: "Ingredient created successfully",
        ingredient: newIngredient,
      })
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Unable to create ingredient",
        error: error.message,
      })
    );
  }
}
