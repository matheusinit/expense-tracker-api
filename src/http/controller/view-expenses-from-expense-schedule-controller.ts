import { Request, Response } from 'express'

import { PageBasedPagination } from '@/data/dtos/page-based-pagination'
import { ExpenseModel } from '@/data/models/expense-model'
import { ExpenseRepository } from '@/data/protocols/expense-repository'
import { ExpenseScheduleRepository } from '@/data/protocols/expense-schedule-repository'

class ViewExpensesFromExpenseScheduleController {
  private readonly expenseScheduleRepository: ExpenseScheduleRepository
  private readonly expenseRepository: ExpenseRepository

  constructor(
    repository: ExpenseScheduleRepository,
    expenseRepository: ExpenseRepository
  ) {
    this.expenseScheduleRepository = repository
    this.expenseRepository = expenseRepository
  }

  async handle(request: Request, response: Response) {
    const id = request.params['id']

    const pageQuery = request.query['page']
    const pageSizeQuery = request.query['pageSize']

    const page = Number(pageQuery ?? '1')
    const pageSize = Number(pageSizeQuery ?? '5')

    const skip = (page - 1) * pageSize

    const expenseSchedule = await this.expenseScheduleRepository.getById(id)

    if (!expenseSchedule) {
      return response.status(404).send({
        message: 'Expense schedule not found'
      })
    }

    const expenses = await this.expenseRepository.getByScheduleId(id, pageSize, skip)

    const totalCount = await this.expenseRepository.countByScheduleId(id)

    const pageCount = Math.ceil(totalCount / pageSize)

    const paginationData: PageBasedPagination<ExpenseModel> = {
      records: expenses,
      _metadata: {
        page: page,
        per_page: pageSize,
        page_count: pageCount,
        total_count: totalCount
      }
    }

    return response.status(200).send(paginationData)
  }
}

export default ViewExpensesFromExpenseScheduleController