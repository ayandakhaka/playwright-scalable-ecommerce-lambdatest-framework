// models/AffiliateForm.ts
import { PaymentMethod, AffiliateCompany, Website } from "../models/AffiliateEnums.js"

export interface AffiliateFormData {
  company: AffiliateCompany;
  website: Website;
  taxId: string;
  paymentMethod: PaymentMethod;
  chequePayeeName?: string; // required if PaymentMethod.Cheque
  paypalEmail?: string;      // required if PaymentMethod.PayPal
  bankDetails?: {
    accountNumber: string;
    accountHolderName: string;
    branchCode: string;
    bankName: string;
  }; // required if PaymentMethod.BankTransfer
}