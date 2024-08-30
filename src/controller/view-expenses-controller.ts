import { Request, Response } from 'express'

class ViewExpensesController {
  async handle(request: Request, response: Response) {

    const expenses = [{}]

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