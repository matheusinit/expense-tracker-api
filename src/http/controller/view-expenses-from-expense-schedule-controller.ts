import { PageBasedPagination } from '@/data/dtos/page-based-pagination'
import { ExpenseModel } from '@/data/models/expense-model'
import { ExpenseScheduleRepository } from '@/data/protocols/expense-schedule-repository'
import db from '@/infra/database'
import { Request, Response } from 'express'

class ViewExpensesFromExpenseScheduleController {
  private readonly repository: ExpenseScheduleRepository

  constructor(repository: ExpenseScheduleRepository) {
    this.repository = repository
  }

  async handle(request: Request, response: Response) {
    const id = request.params['id']

    const pageQuery = request.query['page']
    const pageSizeQuery = request.query['pageSize']

    const page = Number(pageQuery ?? '1')
    const pageSize = Number(pageSizeQuery ?? '5')

    const skip = (page - 1) * pageSize

    const expenseSchedule = await this.repository.getById(id)

    if (!expenseSchedule) {
      return response.status(404).send({
        message: 'Expense schedule not found'
      })
    }

    const expenses = await db.expense.findMany({
      where: {
        ExpenseToExpenseSchedule: {
          every: {
            expenseScheduleId: id
          }
        }
      },
      take: pageSize,
      skip
    })

    const totalCount = await db.expense.count({
      where: {
        ExpenseToExpenseSchedule: {
          every: {
            expenseScheduleId: id
          }
        }
      }
    })

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