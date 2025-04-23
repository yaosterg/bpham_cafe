import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const allCategories = await prisma.category.findMany({
      orderBy: { category: "asc" },
    });

    return new Response(
      JSON.stringify({
        message: "Order founded successfully",
        categories: allCategories,
      })
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Unable to create order",
        error: error.message,
      })
    );
  }
}
