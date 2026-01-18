export type Category = 'food' | 'electronics' | 'clothes' | 'furniture' | 'misc';

export interface Location {
  id: string;
  name: string;
  type: 'refrigerator' | 'closet' | 'drawer' | 'room' | 'box';
  icon: string;
}

export interface Item {
  id: string;
  locationId: string;
  name: string;
  category: Category;
  subCategory?: string;
  purchaseDate: string;
  expiryDate?: string;
  discardDate?: string;
  imageUrl?: string;
  note?: string;
  status: 'active' | 'sold' | 'discarded';
}

export interface SalesListing {
  title: string;
  description: string;
  suggestedPriceRange: string;
  hashtags: string[];
}

export interface ReceiptItem {
  name: string;
  category: Category;
  subCategory?: string;
}