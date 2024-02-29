export interface CommonResponse<T> {
  values: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  isValuesEmpty: boolean;
}
