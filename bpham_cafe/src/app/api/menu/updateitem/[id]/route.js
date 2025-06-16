import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  const id = await params;
  const body = await request.json();
  console.log(id, body);

  try {
    const updatedMenuItem = await prisma.item.update({
      where: { id: Number(id.id) },
      data: body,
    });

    await prisma.itemIngredient.deleteMany({
      where: { itemId: id },
    });

    await prisma.itemIngredient.createMany({
      data: ingredients.map((ingredient) => ({
        itemId: id,
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
