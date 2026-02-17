export interface transcationRows {
  id: string;
  request_id: string;
  from_wallet: string;
  to_wallet: string;
  amount: number;
  status: string;
  created_at: Date;
}
