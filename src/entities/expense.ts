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

    if (value.length > 255) {
      throw new Error('Description length cannot be greather than 255')
    }

    this._description = value
  }

  get amount(): number {
    return this._amount
  }

  set amount(value: number) {
    if (value === undefined) {
      throw new Error('Amount is required. It should be greater than 0')
    }

    if (value === 0) {
      throw new Error('Invalid value for amount. It should be greater than 0.')
    }

    if (value < 0) {
      throw new Error('Amount cannot be a negative value. It should be greater than 0')
    }

    this._amount = value
  }

  update(description: string, amount: number): void {
    if (description !== undefined) {
      this.description = description
    }

    if (amount !== undefined) {
      this.amount = amount
    }
  }
}