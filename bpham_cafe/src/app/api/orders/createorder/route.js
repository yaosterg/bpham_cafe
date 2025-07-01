import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.json();
    console.log("Received order data:", formData);

    const newOrder = await prisma.order.create({
      data: {
        name: formData.name,
        orderItems: {
          create: formData.items.map((item) => ({
            name: item.name,
            notes: item.notes,
            quantity: item.quantity,
            selectedOptions: item.selectedOptions,
            totalPrice: item.totalPrice,
            categoryId: item.categoryId, // Assuming categoryId is passed in the item
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    console.log("New order created:", newOrder);
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
