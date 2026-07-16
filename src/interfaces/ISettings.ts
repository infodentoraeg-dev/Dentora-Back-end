import { Document } from "mongoose";

export interface ISettings extends Document {

  companyName: string;

  supportEmail: string;

  supportPhone: string;

  logo?: string;

  currency: string;

  paymentMethods: {
    visa?: {
      cardHolderName?: string;
      cardNumber?: string;
      expiryDate?: string;
    };

    instapay?: {
      number?: string;
      qrCode?: string;
    };

    vodafoneCash?: {
      number?: string;
      qrCode?: string;
    };

    bankAccount?: {
      bankName?: string;
      accountName?: string;
      accountNumber?: string;
      iban?: string;
      swiftCode?: string;
    };
  };

  createdAt: Date;
  updatedAt: Date;
}