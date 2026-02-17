export interface transactionRows {
  id: string;
  request_id: string;
  from_wallet: string;
  to_wallet: string;
  amount: number;
  status: string;
  created_at: Date;
}

export type param = {
  requestId: string;
  toWallet: string;
  fromWallet: string;
  amount: number;
};
export type returnBody = {
  status: string;
  message: string;
};
