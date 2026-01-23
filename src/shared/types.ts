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
  userId?: string | null;
  userNickname?: string;
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

// Auth Types
export interface User {
  id?: string | null;
  signId: string;
  signPw: string;
  nickname: string;
}

export interface LoginRequest {
  signId: string;
  signPw: string;
}

export interface LoginResponse {
  accessToken: string;
  nickname: string;
}

export interface SignupRequest {
  signId: string;
  signPw: string;
  nickname: string;
}

// API Common Response
export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  body: T;
}