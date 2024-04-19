export interface Listing {
  id?: string;
  address: string;
  quantity: string;
  amount: string;
  status?: ListingStatus;
}

export enum ListingStatus {
  LIVE = 0,
  CANCELLED = 1,
  BOUGHT = 2,
}