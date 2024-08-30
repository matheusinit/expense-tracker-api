import { Request, Response } from 'express'
import db from '../database'

class ViewExpensesController {
  async handle(request: Request, response: Response) {
    const expenses = await db.expense.findMany()

    const metadata = {
      page: 1,
      per_page: 10,
      page_count: 2,
      total_count: expenses.length,
    }

    return response.json({ records: expenses, _metadata: metadata })
  }
}

export default ViewExpensesController