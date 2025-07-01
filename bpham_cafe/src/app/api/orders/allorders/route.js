import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const allOrders = await prisma.order.findMany();
    const allOrderItems = await prisma.orderItem.findMany();
    console.log("All Orders:", allOrders);
    console.log("All Order Items:", allOrderItems);
    return new Response(
      JSON.stringify({
        message: "Order founded successfully",
        order: allOrders,
        orderItems: allOrderItems,
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
