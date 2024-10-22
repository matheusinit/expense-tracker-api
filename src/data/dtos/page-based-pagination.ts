export type PageBasedPagination<T> = {
  records: T[],
  _metadata: {
    page: number
    per_page: number
    page_count: number
    total_count: number
  }
}
