export class Expense {
  private _description!: string
  private _amount!: number

  constructor(description: string, amount: number) {
    this.description = description
    this.amount = amount
  }

  get description(): string {
    return this._description
  }

  set description(value: string) {
    if (!value) {
      throw new Error('Description is required')
    }

    this._description = value
  }

  get amount(): number {
    return this._amount
  }

  set amount(value: number) {
    if (!value) {
      throw new Error('Amount is required. It should be greater than 0')
    }

    if (value < 0) {
      throw new Error('Amount cannot be a negative value. It should be greater than 0')
    }

    this._amount = value
  }
}