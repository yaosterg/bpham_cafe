import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.json();
    formData.orders.completedAt = new Date();
    formData.orders.status = "complete";
    const newOrder = await prisma.orders.update({
      where: { id: formData.id },
      data: {
        orders: formData.orders,
      },
    });
    console.log("this is completed order", newOrder);
    return new Response(
      JSON.stringify({
        message: "Order created successfully",
        order: newOrder,
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
