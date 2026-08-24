import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const numericId = Number(id);
    const body = await request.json();

    const category = await prisma.category.findUnique({
      where: { id: numericId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    //rename the category first
    const updated = await prisma.category.update({
      where: { id: numericId },
      data: { name: body.name },
    });

    // update expenses in the background — don't await
    prisma.expense
      .updateMany({
        where: { category: category.name },
        data: { category: body.name },
      })
      .catch((error) => {
        console.error("Background expense category update failed:", error);
      });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // find the category name first
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    // move all expenses in this category to "other"
    await prisma.expense.updateMany({
      where: { category: category.name },
      data: { category: "other" },
    });

    await prisma.category.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
