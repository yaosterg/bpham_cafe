import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const allOrders = await prisma.orders.findMany();
    return new Response(
      JSON.stringify({
        message: "Order founded successfully",
        order: allOrders,
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
