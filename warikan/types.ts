
export type Payer = 'Aさん' | 'Bさん';

export interface Expense {
  id: string;
  date: string; // ISO format: YYYY-MM-DD
  payer: Payer;
  amount: number;
  burdenRate: number; // 0.0, 0.5, or 1.0 (This is the "Partner's" share rate)
  isSettled: boolean;
}

export type ViewState = 'LIST' | 'FORM' | 'SUMMARY' | 'DATA';
