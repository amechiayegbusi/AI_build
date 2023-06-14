export interface ResponseAttributes {
  success?: boolean | null;
  message?: string | null;
  status?: string | null;
};

export interface TransactionSearchAttributes {
  idUser?: number | null;
  limit?: number | null;
  type?: string | null;
  aggregateType?: string | null;
  page?: number | null;
};