type Status = 'PAID' | 'OVERDUE' | 'OPEN'

export class ExpenseScheduleStatus {
  private status: Status

  constructor(status: Status = 'OPEN') {
    this.status = status
  }

  get value(): Status {
    return this.status
  }

  set value(status: Status) {
    if (!['PAID', 'OVERDUE', 'OPEN'].includes(status)) {
      throw new Error('Invalid status')
    }

    this.status = status
  }
}