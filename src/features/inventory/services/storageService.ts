import { apiClient } from '@/shared/services/apiClient';
import { ApiResponse, Location } from '@/shared/types';
import { LOCATION_TYPE_ICONS } from '@/shared/constants/inventory';

// ─── 백엔드 DTO 타입 ──────────────────────────────────────────────────────────

interface SaveStorageDto {
  name: string;
  location: string; // 프론트엔드 Location.type 값을 저장 (e.g. 'refrigerator')
  memo: string;
}

interface FindStorageDto {
  storageId: number;
  name: string;
  location: string; // type 키
  memo: string;
  createdAt: string;
  updatedAt: string;
}

// ─── 변환 헬퍼 ──────────────────────────────────────────────────────────────

const toLocation = (dto: FindStorageDto): Location => ({
  id: String(dto.storageId),
  name: dto.name,
  type: (dto.location as Location['type']) ?? 'box',
  icon: LOCATION_TYPE_ICONS[dto.location] ?? '📦',
});

const toSaveDto = (loc: Location): SaveStorageDto => ({
  name: loc.name,
  location: loc.type,
  memo: '',
});

// ─── API 함수 ────────────────────────────────────────────────────────────────

/** 전체 보관함 목록 조회 */
export const getStorages = async (): Promise<Location[]> => {
  const res = await apiClient.get<ApiResponse<FindStorageDto[]>>('/storages');
  return res.data.body.map(toLocation);
};

/** 보관함 생성 */
export const createStorage = async (loc: Location): Promise<void> => {
  await apiClient.post('/storages', toSaveDto(loc));
};

/** 보관함 수정 */
export const updateStorage = async (loc: Location): Promise<void> => {
  await apiClient.put(`/storages/${loc.id}`, toSaveDto(loc));
};

/** 보관함 삭제 */
export const deleteStorage = async (id: string): Promise<void> => {
  await apiClient.delete(`/storages/${id}`);
};
