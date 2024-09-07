import { Request, Response } from 'express'
import ExpenseRepository from '../repository/expense-repository'

class ViewExpensesController {
  private readonly repository: ExpenseRepository

  constructor() {
    this.repository = new ExpenseRepository()
  }

  async handle(request: Request, response: Response) {
    const pageQuery = request.query['page']
    const pageSizeQuery = request.query['pageSize']

    const page = Number(pageQuery ?? '1')
    const pageSize = Number(pageSizeQuery ?? '5')

    const skip = (page - 1) * pageSize

    const expenses = await this.repository.getMany(pageSize, skip)

    const totalCount = await this.repository.count()

    const pageCount = Math.ceil(totalCount / pageSize)

    const metadata = {
      page: page,
      per_page: pageSize,
      page_count: pageCount,
      total_count: totalCount,
    }

    return response.send({ records: expenses, _metadata: metadata })
  }
}

export default ViewExpensesController