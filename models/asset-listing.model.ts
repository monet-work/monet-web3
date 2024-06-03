export interface AssetListing {
  Id: string;
  amount: string;
  pricePerPoint: string;
  totalPrice: string;
  owner: string;
  asset: string;
  paymentToken: string;
  listingType: number;
  paymentType: number;
  fillType: number;
  status: string;
}

export enum ListingStatus {
  ACTIVE = 0,
  INACTIVE = 1,
}

export enum ListingFillType {
  PARTIAL = 0,
  FULL = 1,
}

export enum ListingType {
  BUY = 0,
  SELL = 1,
}

export enum PaymentType {
  NATIVE_TOKEN = 0,
  CUSTOM_TOKEN = 1,
}
