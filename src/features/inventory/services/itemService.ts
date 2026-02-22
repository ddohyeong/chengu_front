import { apiClient } from '@/shared/services/apiClient';
import { ApiResponse, Item } from '@/shared/types';
import { authStorage } from '@/shared/services/authStorage';
import { categoryToId, idToCategory } from './categoryService';

// ─── 백엔드 DTO 타입 ──────────────────────────────────────────────────────────

interface SaveItemDto {
  memberId: number;
  name: string;
  itemCategoryId: number;
  quantity: number;
  storageId: number;
  purchaseDate: string;
  expirationDate: string;
  disposalDate: string;
  memo: string;
}

interface FindItemDto {
  itemId: number;
  name: string;
  itemCategoryId: number;
  quantity: number;
  storageId: number;
  purchaseDate: string;
  expirationDate: string;
  disposalDate: string;
  memo: string;
  createdAt: string;
  updatedAt: string;
}

interface DeleteItemDto {
  itemId: number;
}

// ─── memo 필드에 저장할 프론트엔드 전용 메타데이터 ──────────────────────────

interface ItemMeta {
  subCategory?: string;
  imageUrl?: string;
  status?: 'active' | 'sold' | 'discarded';
  userNickname?: string;
  note?: string;
}

const parseMeta = (memo: string): ItemMeta => {
  try {
    return JSON.parse(memo) as ItemMeta;
  } catch {
    // memo가 JSON이 아닌 경우 (예: 순수 텍스트) note로 처리
    return { note: memo || undefined };
  }
};

const stringifyMeta = (meta: ItemMeta): string => {
  return JSON.stringify(meta);
};

// ─── 변환 헬퍼 ──────────────────────────────────────────────────────────────

const toItem = (dto: FindItemDto): Item => {
  const meta = parseMeta(dto.memo);
  return {
    id: String(dto.itemId),
    locationId: String(dto.storageId),
    name: dto.name,
    category: idToCategory(dto.itemCategoryId),
    categoryId: dto.itemCategoryId,   // 백엔드 ID 그대로 보존 (정확한 roundtrip)
    subCategory: meta.subCategory,
    purchaseDate: dto.purchaseDate ?? '',
    expiryDate: dto.expirationDate || undefined,
    discardDate: dto.disposalDate || undefined,
    imageUrl: meta.imageUrl,
    note: meta.note,
    status: meta.status ?? 'active',
    userNickname: meta.userNickname,
  };
};

const toSaveDto = (item: Item): SaveItemDto => {
  const memberId = authStorage.getMemberId() ?? 0;
  const meta: ItemMeta = {
    subCategory: item.subCategory,
    imageUrl: item.imageUrl,
    status: item.status,
    userNickname: item.userNickname,
    note: item.note,
  };
  return {
    memberId,
    name: item.name,
    // categoryId(자식/부모 백엔드 ID)가 있으면 우선 사용, 없으면 string key로 폴백
    itemCategoryId: item.categoryId ?? categoryToId(item.category),
    quantity: 1,
    storageId: Number(item.locationId),
    purchaseDate: item.purchaseDate ?? '',
    expirationDate: item.expiryDate ?? '',
    disposalDate: item.discardDate ?? '',
    memo: stringifyMeta(meta),
  };
};

// ─── API 함수 ────────────────────────────────────────────────────────────────

/** 전체 물건 목록 조회 */
export const getItems = async (): Promise<Item[]> => {
  const res = await apiClient.get<ApiResponse<FindItemDto[]>>('/items');
  return res.data.body.map(toItem);
};

/**
 * 물건 저장 (생성 또는 수정)
 * - 신규: POST /items
 * - 기존 (백엔드 ID): DELETE 후 POST (백엔드에 PUT 없음)
 */
export const saveItem = async (item: Item): Promise<void> => {
  await apiClient.post('/items', [toSaveDto(item)]);
};

export const updateItem = async (item: Item): Promise<void> => {
  await apiClient.patch(`/items/${item.id}`, toSaveDto(item));
}

/**
 * 물건 일괄 등록 (영수증 스캔 등)
 */
export const bulkCreateItems = async (items: Item[]): Promise<void> => {
  const dtos = items.map(toSaveDto);
  await apiClient.post('/items', dtos);
};

/**
 * 물건 삭제
 * DELETE /api/v1/items (body에 itemId)
 */
export const deleteItem = async (id: string): Promise<void> => {
  const body: DeleteItemDto = { itemId: Number(id) };
  await apiClient.delete('/items', { data: body });
};
