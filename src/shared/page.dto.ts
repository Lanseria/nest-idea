export class Page<T> {
  constructor(size, current, counts, records: T[]) {
    this.size = size;
    this.current = current;
    this.records = records;
    this.total = counts;
    this.pages = Math.ceil(counts / size);
  }
  private size: number;
  private current: number;
  private pages: number;
  private total: number;
  private records: T[];
}
