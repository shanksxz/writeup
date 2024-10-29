export interface JwtPayload {
  id: string;
  email: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}
