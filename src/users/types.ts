export interface userType {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  country: string;
}
export interface walletType {
  id: string;
  balance: number;
}
export interface param {
  firstName: string;
  lastName: string;
  gender: "M" | "F";
  passwordHash: string;
  country: string;
  curreny: string;
  email: string;
}
