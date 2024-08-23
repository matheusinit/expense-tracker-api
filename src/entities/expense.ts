export class Expense {
  private _description: string
  private _amount: number

  constructor(description: string, amount: number) {
    if (!description) {
      throw new Error('Description is required')
    }

    throw new Error('Amount is required. It should be greater than 0')

    this._description = description
    this._amount = amount
  }

  get description(): string {
    return this._description
  }

  get amount(): number {
    return this._amount
  }
}