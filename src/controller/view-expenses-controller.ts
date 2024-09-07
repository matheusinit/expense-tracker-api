import { Request, Response } from 'express'
import db from '../database'

class ViewExpensesController {
  async handle(request: Request, response: Response) {
    const page = Number(request.query['page'] ?? '1')
    const pageSize = Number(request.query['pageSize'] ?? '5')

    const expenses = await db.expense.findMany({
      take: pageSize,
      skip: (page - 1) * 5,
    })
    const totalCount = await db.expense.count()

    const pageCount = Math.ceil(totalCount / pageSize)

    const metadata = {
      page: page,
      per_page: pageSize,
      page_count: pageCount,
      total_count: totalCount,
    }

    return response.json({ records: expenses, _metadata: metadata })
  }
}

export default ViewExpensesController