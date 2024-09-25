export enum Status {
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  PENDING = 'PENDING',
  OPEN = 'OPEN'
}
export class ExpenseScheduleStatus {
  private status: Status

  constructor(status: Status = Status.OPEN) {
    this.status = status
  }

  get value(): Status {
    return this.status
  }

  set value(status: Status) {
    if (!['PAID', 'OVERDUE', 'OPEN', 'PENDING'].includes(status)) {
      throw new Error('Invalid status')
    }

    this.status = status
  }

  asEnum(status: string): Status {
    if (!(status in Status)) {
      throw new Error('Invalid status')
    }

    return Status[status as keyof typeof Status]
  }
}