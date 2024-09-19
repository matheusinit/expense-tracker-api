import { Request, Response } from 'express'
import ExpenseRepository from '@/repository/expense-repository'

class ViewExpensesController {
  private readonly repository: ExpenseRepository

  constructor(repository: ExpenseRepository) {
    this.repository = repository
  }

  async handle(request: Request, response: Response) {
    const pageQuery = request.query['page']
    const pageSizeQuery = request.query['pageSize']
    const fieldsQuery = String(request.query['fields'] ?? '')

    const page = Number(pageQuery ?? '1')
    const pageSize = Number(pageSizeQuery ?? '5')

    const skip = (page - 1) * pageSize

    const fields = fieldsQuery !== '' ? fieldsQuery?.split(',').map(field => field.trim()) : undefined
    const columns = await this.repository.getColumns()

    if (fields) {
      const invalidFields = fields.filter(field => !columns.includes(field))

      if (invalidFields.length > 0) {
        return response.status(400).send({ message: `Invalid fields: ${invalidFields.join(', ')}` })
      }
    }

    const expenses = await this.repository.getMany(pageSize, skip, fields)

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