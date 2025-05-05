import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const allMenuItems = await prisma.item.findMany({
      orderBy: { name: "asc" },
    });

    return new Response(
      JSON.stringify({
        message: "Menu items founded successfully",
        items: allMenuItems,
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
