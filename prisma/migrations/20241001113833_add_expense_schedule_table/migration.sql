-- CreateTable
CREATE TABLE "ExpenseToExpenseSchedule" (
    "expenseId" TEXT NOT NULL,
    "expenseScheduleId" TEXT NOT NULL,

    CONSTRAINT "ExpenseToExpenseSchedule_pkey" PRIMARY KEY ("expenseId","expenseScheduleId")
);

-- CreateTable
CREATE TABLE "ExpenseSchedule" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "period" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ExpenseSchedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExpenseToExpenseSchedule" ADD CONSTRAINT "ExpenseToExpenseSchedule_expenseScheduleId_fkey" FOREIGN KEY ("expenseScheduleId") REFERENCES "ExpenseSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseToExpenseSchedule" ADD CONSTRAINT "ExpenseToExpenseSchedule_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
