import { Request, Response } from 'express'

class DeleteExpenseController {
  async handle(request: Request, response: Response) {
    return response.status(404).send({
      message: 'Expense not found'
    })
  }
}

export default DeleteExpenseController