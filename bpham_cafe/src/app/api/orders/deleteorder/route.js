import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.json();
    console.log("this is formData", formData);
    const newOrder = await prisma.orders.delete({
      where: { id: formData.id },
    });
    return new Response(
      JSON.stringify({
        message: "Order deleted successfully",
        order: newOrder,
      })
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Unable to delete order",
        error: error.message,
      })
    );
  }
}
