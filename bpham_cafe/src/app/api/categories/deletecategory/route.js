import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.json();

    const deletedCategory = await prisma.category.delete({
      where: { id: formData.id },
    });

    return new Response(
      JSON.stringify({
        message: "Category created successfully",
        category: deletedCategory,
      })
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Unable to create category",
        error: error.message,
      })
    );
  }
}
