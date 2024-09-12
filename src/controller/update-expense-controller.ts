import { Request, Response } from 'express'

class UpdateExpenseController {
  async handle(request: Request, response: Response) {
    return response.status(404).send({ message: 'Expense not found' })
  }
}

export default UpdateExpenseController