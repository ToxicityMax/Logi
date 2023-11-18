export interface Log {
  level: string;
  message: string;
  resourceID: string;
  timestamp: Date;
  traceID: string;
  spanID: string;
  commit: string;
  metadata: {
    parentResourceId: string;
  };
}
export interface LogSearchResult {
  results: Log;
  totalCount: number;

  currentPage: number;

  totalPages: number;
}
