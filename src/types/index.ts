export interface FormData {
  productName: string;
  productDescription: string;
  location: string;
}

export interface GenerationHistory {
  id: string;
  productName: string;
  productDescription: string;
  location: string;
  timestamp: string;
  status: 'success' | 'error';
  leadsCount?: number;
  sheetLink?: string;
  errorMessage?: string;
}
