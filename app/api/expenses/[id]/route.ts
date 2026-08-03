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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if expense exists
    const existingExpense = await prisma.expense.findUnique({
      where: { id: Number(id) },
    });

    if (!existingExpense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Update the expense
    const expense = await prisma.expense.update({
      where: { id: Number(id) },
      data: {
        title: body.title,
        amount: body.amount,
        category: body.category,
        // Update notes: delete all existing notes and create new ones
        notes: {
          deleteMany: {}, // Remove all existing notes
          create: body.notes?.map((content: string) => ({ content })) || [],
        },
      },
      include: { notes: true },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Error updating expense:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update expense";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Check if expense exists
    const existingExpense = await prisma.expense.findUnique({
      where: { id: Number(id) },
    });

    if (!existingExpense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    await prisma.expense.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete expense";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
