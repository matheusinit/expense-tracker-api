export class Expense {
  private _description: string
  private _amount: number

  constructor(description: string, amount: number) {
    throw new Error('Description is required')

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