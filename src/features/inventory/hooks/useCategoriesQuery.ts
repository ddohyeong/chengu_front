import { useQuery } from '@tanstack/react-query';
import { fetchCategories, CategoryDto } from '../services/categoryService';

export const CATEGORIES_QUERY_KEY = ['categories'] as const;

/**
 * 카테고리 목록 조회 (부모 + 자식 트리)
 * GET /api/v1/categories
 * 10분간 캐시 유지 — 모달 열 때마다 재요청하지 않음
 */
export const useCategoriesQuery = () => {
  return useQuery<CategoryDto[]>({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10,
  });
};
