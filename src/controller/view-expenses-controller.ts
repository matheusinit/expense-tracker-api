import { Request, Response } from 'express'
import db from '../database'

class ViewExpensesController {
  async handle(request: Request, response: Response) {
    const pageQuery = request.query['page']
    const pageSizeQuery = request.query['pageSize']

    const page = Number(pageQuery ?? '1')
    const pageSize = Number(pageSizeQuery ?? '5')

    const skip = (page - 1) * 5

    const expenses = await db.expense.findMany({
      take: pageSize,
      skip,
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