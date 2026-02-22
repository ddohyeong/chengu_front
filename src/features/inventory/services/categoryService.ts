import { apiClient } from '@/shared/services/apiClient';
import { ApiResponse, Category } from '@/shared/types';

// ─── 백엔드 카테고리 DTO ───────────────────────────────────────────────────────

export interface CategoryDto {
  id: number;
  name: string;
  children: CategoryDto[];
}

// ─── ID ↔ Category 키 매핑 ──────────────────────────────────────────────────
// GET /api/v1/categories 응답 기준 (실제 백엔드 데이터)
// 1:의류, 2:식품, 3:전자기기, 4:생활용품, 5:가구/인테리어, 6:도서/문구, 7:스포츠/레저, 8:뷰티/미용

const CATEGORY_TO_ID: Record<Category, number> = {
  clothes: 1,
  food: 2,
  electronics: 3,
  misc: 4,      // 생활용품 → misc 대표
  furniture: 5,
};

// 부모 카테고리 ID → 프론트엔드 Category 키
const PARENT_ID_TO_CATEGORY: Record<number, Category> = {
  1: 'clothes',
  2: 'food',
  3: 'electronics',
  4: 'misc',
  5: 'furniture',
  6: 'misc',  // 도서/문구 → misc
  7: 'misc',  // 스포츠/레저 → misc
  8: 'misc',  // 뷰티/미용 → misc
};

// 자식 카테고리 ID → 부모 ID 매핑 (실제 백엔드 데이터 기준)
export const CHILD_TO_PARENT_ID: Record<number, number> = {
  // 의류(1) children: 9~14
  9: 1, 10: 1, 11: 1, 12: 1, 13: 1, 14: 1,
  // 식품(2) children: 15~20
  15: 2, 16: 2, 17: 2, 18: 2, 19: 2, 20: 2,
  // 전자기기(3) children: 21~25
  21: 3, 22: 3, 23: 3, 24: 3, 25: 3,
  // 생활용품(4) children: 26~29
  26: 4, 27: 4, 28: 4, 29: 4,
  // 가구/인테리어(5) children: 30~34
  30: 5, 31: 5, 32: 5, 33: 5, 34: 5,
  // 도서/문구(6) children: 35~39
  35: 6, 36: 6, 37: 6, 38: 6, 39: 6,
  // 스포츠/레저(7) children: 40~43
  40: 7, 41: 7, 42: 7, 43: 7,
  // 뷰티/미용(8) children: 44~47
  44: 8, 45: 8, 46: 8, 47: 8,
};

// ─── 변환 헬퍼 ──────────────────────────────────────────────────────────────

/**
 * 프론트엔드 Category 키 → 백엔드 부모 카테고리 ID
 */
export const categoryToId = (category: Category): number => {
  return CATEGORY_TO_ID[category] ?? 4; // 기본값: 생활용품(misc)
};

/**
 * 백엔드 itemCategoryId → 프론트엔드 Category 키
 * 자식 ID인 경우 부모 카테고리로 매핑
 */
export const idToCategory = (id: number): Category => {
  if (PARENT_ID_TO_CATEGORY[id]) return PARENT_ID_TO_CATEGORY[id];
  const parentId = CHILD_TO_PARENT_ID[id];
  return parentId ? (PARENT_ID_TO_CATEGORY[parentId] ?? 'misc') : 'misc';
};

/**
 * 자식 ID → 부모 ID 반환 (부모 ID 그대로면 null)
 */
export const getParentId = (id: number): number | null => {
  return CHILD_TO_PARENT_ID[id] ?? null;
};

// ─── API 함수 ────────────────────────────────────────────────────────────────

/**
 * 전체 카테고리 트리 조회 (부모 + 자식 포함)
 * GET /api/v1/categories
 */
export const fetchCategories = async (): Promise<CategoryDto[]> => {
  const res = await apiClient.get<ApiResponse<CategoryDto[]>>('/categories');
  return res.data.body;
};
