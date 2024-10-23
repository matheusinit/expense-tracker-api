export class Installment {
  private installmentNumber: number
  private totalInstallments: number
  private amount: number
  private paidAt: Date | null

  constructor(
    amount: number,
    installmentNumber: number,
    totalInstallments: number
  ) {
    this.amount = amount
    this.installmentNumber = installmentNumber
    this.totalInstallments = totalInstallments
    this.paidAt = null
  }
}
