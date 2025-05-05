import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const p = await params;
  const id = Number(p.id);

  try {
    const menuByID = await prisma.item.findMany({
      where: {
        categoryId: id,
      },
      orderBy: { name: "asc" },
    });

    return new Response(
      JSON.stringify({
        message: "Menu items founded successfully",
        items: menuByID,
      })
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Unable to find menu items",
        error: error.message,
      })
    );
  }
}
