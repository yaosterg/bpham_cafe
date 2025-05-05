import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.json();
    const deletedMenuItem = await prisma.item.delete({
      where: { id: formData.id },
    });

    return new Response(
      JSON.stringify({
        message: "Menu item deleted successfully",
        item: deletedMenuItem,
      })
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Unable to delete menu item",
        error: error.message,
      })
    );
  }
}
