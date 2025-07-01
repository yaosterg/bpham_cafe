import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.json();
    console.log("Form data received for deletion:", formData);

    const deleteOrderItems = await prisma.orderItem.deleteMany({
      where: { orderId: formData.id },
    });
    const deletedOrder = await prisma.order.delete({
      where: { id: formData.id },
    });

    const allOrders = await prisma.order.findMany();
    const orderItems = await prisma.orderItem.findMany();

    return new Response(
      JSON.stringify({
        message: "Order deleted successfully, new orders & order items fetched",
        deletedOrder: deletedOrder,
        deleteOrderItems: deleteOrderItems,
        order: allOrders,
        orderItems: orderItems,
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
