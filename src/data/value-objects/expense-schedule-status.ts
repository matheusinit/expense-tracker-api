export type ExpenseScheduleStatusEnum = 'PAID' | 'OVERDUE' | 'PENDING' | 'OPEN'
export class ExpenseScheduleStatus {
  private status: ExpenseScheduleStatusEnum

  constructor(status: ExpenseScheduleStatusEnum = 'OPEN') {
    this.status = status
  }

  get value(): ExpenseScheduleStatusEnum {
    return this.status
  }

  set value(status: ExpenseScheduleStatusEnum) {
    if (!['PAID', 'OVERDUE', 'OPEN', 'PENDING'].includes(status)) {
      throw new Error('Invalid status')
    }

    this.status = status
  }
}