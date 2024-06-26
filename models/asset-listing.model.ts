export interface AssetListing {
  Id: string;
  amount: string;
  pricePerPoint: string;
  totalPrice: string;
  owner: string;
  asset: string;
  paymentToken: string;
  listingType: ListingType;
  paymentType: PaymentType;
  fillType: ListingFillType;
  status: ListingStatus;
  action?: JSX.Element;
}

export enum ListingFillType {
  PARTIAL = 0,
  FULL = 1,
}

export enum ListingType {
  BUY = 0,
  SELL = 1,
}

export enum AssetStatus {
  LIVE = 0,
  DOWN = 1,
}
export enum PaymentType {
  NATIVE_TOKEN = 0,
  CUSTOM_TOKEN = 1,
}

export enum ListingStatus {
  LIVE = 0,
  CANCELLED = 1,
  BOUGHT = 2,
}
