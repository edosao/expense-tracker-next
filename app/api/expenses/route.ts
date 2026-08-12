import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      include: { notes: true },
      orderBy: { createdAt: "desc" },
    });

    //Convert Decimal to number
    const transformed = expenses.map((exp) => ({
      ...exp,
      amount: Number(exp.amount),
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch expenses";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const expense = await prisma.expense.create({
      data: {
        title: body.title,
        amount: body.amount,
        category: body.category,
        notes: {
          create: body.notes?.map((content: string) => ({ content })) || [],
        },
      },
      include: { notes: true },
    });

    const transformed = {
      ...expense,
      amount: Number(expense.amount),
    };

    return NextResponse.json(transformed, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create expense";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
