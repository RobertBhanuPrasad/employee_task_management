export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const getPaginationOptions = (query: any): PaginationOptions => {
  const page = query.page ? parseInt(query.page as string, 10) : 1;
  const limit = query.limit ? parseInt(query.limit as string, 10) : 10;
  const sortBy = (query.sortBy as string) || (query.sort as string) || 'created_at';
  const rawSortOrder = (query.sortOrder as string) || (query.order as string);
  const sortOrder = rawSortOrder?.toLowerCase() === 'asc' ? 'asc' : 'desc';

  return {
    page: page > 0 ? page : 1,
    limit: limit > 0 ? limit : 10,
    sortBy,
    sortOrder
  };
};

export const getPaginationData = (totalRecords: number, page: number, limit: number) => {
  return {
    totalRecords,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
    limit
  };
};
