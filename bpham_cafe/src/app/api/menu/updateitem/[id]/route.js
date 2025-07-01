import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  console.log(body);

  try {
    const updatedMenuItem = await prisma.item.update({
      where: { id: Number(id) },
      data: {
        name: body.name,
        description: body.description,
        imageURL: body.imageURL,
        price: body.price,
        menuStatus: body.status,
        options: body.options,
      },
    });

    await prisma.itemIngredient.deleteMany({
      where: { itemId: Number(id) },
    });

    await prisma.itemIngredient.createMany({
      data: body.ingredients.map((ingredient) => ({
        itemId: Number(id),
        ingredientId: ingredient.ingredientId,
        qty: ingredient.quantity,
      })),
    });

    return NextResponse.json({
      message: "Menu item updated successfully",
      item: updatedMenuItem,
    });
  } catch (error) {
    console.error("Update failed:", error);
    return NextResponse.json(
      { error: "Update failed", details: error.message },
      { status: 500 }
    );
  }
}
