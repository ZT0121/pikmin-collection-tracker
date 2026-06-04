export type PikminType = 'red' | 'yellow' | 'blue' | 'purple' | 'white' | 'rock' | 'winged' | 'ice';

export const PIKMIN_TYPES: PikminType[] = ['red', 'yellow', 'blue', 'white', 'purple', 'rock', 'winged', 'ice'];

export const PIKMIN_TYPE_NAMES: Record<PikminType, string> = {
  red: '紅色 Pikmin',
  yellow: '黃色 Pikmin',
  blue: '藍色 Pikmin',
  purple: '紫色 Pikmin',
  white: '白色 Pikmin',
  rock: '岩石 Pikmin',
  winged: '羽翅 Pikmin',
  ice: '冰凍 Pikmin',
};

export const PIKMIN_TYPE_COLORS: Record<PikminType, string> = {
  red: 'bg-pikmin-red',
  yellow: 'bg-pikmin-yellow',
  blue: 'bg-pikmin-blue',
  purple: 'bg-pikmin-purple',
  white: 'bg-pikmin-white',
  rock: 'bg-pikmin-rock',
  winged: 'bg-pikmin-winged',
  ice: 'bg-pikmin-ice',
};

export type DecorCategoryType =
  | 'regular'
  | 'special'
  | 'roadside'
  | 'weather'
  | 'regional'
  | 'rare';

export const DECOR_CATEGORY_TYPES: { id: DecorCategoryType; name: string; description: string }[] = [
  { id: 'regular', name: '地點 Decor', description: '在特定地點取得的 Decor' },
  { id: 'special', name: '活動限定', description: '期間活動或特殊任務取得' },
  { id: 'roadside', name: '路邊', description: '路邊幼苗取得' },
  { id: 'weather', name: '天氣', description: '特定天氣條件取得' },
  { id: 'regional', name: '地區限定', description: '特定國家或地區限定' },
  { id: 'rare', name: '稀有款', description: '一般 Decor 的稀有變體' },
];

export interface DecorCategory {
  id: string;
  name: string;
  nameEn: string;
  type: DecorCategoryType;
  icon?: string;
  description?: string;
}

export interface DecorVariant {
  id: string;
  name: string;
  nameEn: string;
  imageUrl?: string;
  localImage?: string;
  isRare?: boolean;
}

export interface DecorItem {
  id: string;
  categoryId: string;
  variantId: string;
  pikminType: PikminType;
  available: boolean;
}

export type CollectionItemStatus = 'none' | 'seedling' | 'plucked' | 'decor';
export type StoredCollectionItemStatus = Exclude<CollectionItemStatus, 'none'>;

export interface DecorDefinition {
  category: DecorCategory;
  variants: DecorVariant[];
  availablePikminTypes: PikminType[];
}

export interface CollectionState {
  collected: Record<string, StoredCollectionItemStatus | boolean>;
  lastUpdated: string;
  version: number;
}

export interface CollectionStats {
  total: number;
  collected: number;
  percentage: number;
  byCategory: Record<string, { total: number; collected: number }>;
  byPikminType: Record<PikminType, { total: number; collected: number }>;
  byCategoryType: Record<DecorCategoryType, { total: number; collected: number }>;
}
