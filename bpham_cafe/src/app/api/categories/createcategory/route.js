import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.json();
    console.log("Form Data:", formData);

    const newCategory = await prisma.category.create({
      data: { category: formData.newCategory },
    });

    return new Response(
      JSON.stringify({
        message: "Category created successfully",
        category: newCategory,
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
