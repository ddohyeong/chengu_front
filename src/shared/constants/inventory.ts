import { Category } from '@/shared/types';

export const CATEGORY_ICONS: Record<string, string> = {
  food: '🍎',
  electronics: '📱',
  clothes: '👕',
  furniture: '🪑',
  misc: '📦',
};

export const CATEGORY_STYLES: Record<string, string> = {
  food: 'bg-emerald-100 text-emerald-700',
  electronics: 'bg-blue-100 text-blue-700',
  clothes: 'bg-violet-100 text-violet-700',
  furniture: 'bg-amber-100 text-amber-700',
  misc: 'bg-slate-100 text-slate-600',
};

export const CATEGORY_LABELS: Record<string, string> = {
  food: '식품',
  electronics: '전자제품',
  clothes: '의류',
  furniture: '가구',
  misc: '기타',
};

export const SUB_CATEGORIES: Record<Category, string[]> = {
  food: ['신선식품', '냉동/간편식', '음료/주류', '간식', '조미료', '기타 식품'],
  electronics: ['스마트폰/태블릿', 'PC/노트북', '생활가전', '주방가전', '액세서리', '기타 가전'],
  clothes: ['상의', '하의', '아우터', '신발', '패션잡화', '기타 의류'],
  furniture: ['침실가구', '거실가구', '주방가구', '수납가구', '인테리어', '기타 가구'],
  misc: ['도서/문구', '생활용품', '화장품', '공구', '취미', '기타'],
};

export const LOCATION_TYPE_ICONS: Record<string, string> = {
  refrigerator: '❄️',
  closet: '👕',
  drawer: '🗄️',
  room: '🏠',
  box: '📦',
};

export const LOCATION_TYPE_LABELS: Record<string, string> = {
  refrigerator: '냉장고',
  closet: '옷장',
  drawer: '서랍장',
  room: '방',
  box: '수납박스',
};
