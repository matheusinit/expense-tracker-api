import { Request, Response } from 'express'
import db from '../database'

class ViewExpensesController {
  async handle(request: Request, response: Response) {
    const expenses = await db.expense.findMany({
      take: 5,
      skip: 0,
    })
    const totalCount = await db.expense.count()

    const page = 1
    const perPage = 5
    const pageCount = Math.ceil(totalCount / perPage)

    const metadata = {
      page: page,
      per_page: perPage,
      page_count: pageCount,
      total_count: totalCount,
    }

    return response.json({ records: expenses, _metadata: metadata })
  }
}

export default ViewExpensesController