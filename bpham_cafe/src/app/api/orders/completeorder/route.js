import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  const timeNow = new Date();
  console.log("Current Time:", timeNow);
  try {
    const formData = await req.json();
    const newOrder = await prisma.order.update({
      where: { id: formData.id },
      data: {
        completedStatus: true,
      },
    });
    console.log("Order Completed:", newOrder);

    const allNewOrders = await prisma.order.findMany();
    return new Response(
      JSON.stringify({
        message: "Order created successfully",
        order: newOrder,
        allOrders: allNewOrders,
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
