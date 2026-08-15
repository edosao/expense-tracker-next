import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    // update all expenses with the old category name to the new name
    await prisma.expense.updateMany({
      where: { category: category.name },
      data: { category: body.name },
    });

    // then rename the category
    const updated = await prisma.category.update({
      where: { id: Number(id) },
      data: { name: body.name },
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
