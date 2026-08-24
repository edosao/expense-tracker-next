export interface INote {
  id: string;
  content: string;
  expense_id: string;
}

export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  createdAt: number;
  notes: INote[];
};

export type ActiveTab = "expenses" | "categories";
