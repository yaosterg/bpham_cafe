import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  const id = await params;
  const body = await request.json();
  console.log(id, body);

  try {
    const updatedCategory = await prisma.category.update({
      where: { id: Number(id.id) }, // or just id if it's a string
      data: { category: body.newName },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Update failed:", error);
    return NextResponse.json(
      { error: "Update failed", details: error.message },
      { status: 500 }
    );
  }
}
