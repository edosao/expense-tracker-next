import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET a single expense by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const expense = await prisma.expense.findUnique({
      where: { id: Number(id) },
      include: { notes: true },
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Error fetching expense:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch expense";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const expense = await prisma.expense.update({
      where: { id: Number(id) },
      data: {
        title: body.title,
        amount: body.amount,
        category: body.category,
      },
      include: { notes: true },
    });

    const transformed = {
      ...expense,
      amount: Number(expense.amount),
    };

    return NextResponse.json(transformed);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update expense" },
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
    await prisma.expense.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Expense deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 },
    );
  }
}
