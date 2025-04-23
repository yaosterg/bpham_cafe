import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.json();
    formData.createdAt = new Date();
    const newOrder = await prisma.orders.create({ data: { orders: formData } });
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
