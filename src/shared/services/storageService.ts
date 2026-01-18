import { Item, Location } from '../types';

const STORAGE_KEYS = {
  LOCATIONS: 'smartkeeper_locations',
  ITEMS: 'smartkeeper_items',
};

// Initial Data Seed
const initialLocations: Location[] = [
  { id: 'loc-1', name: '주방 냉장고', type: 'refrigerator', icon: '❄️' },
  { id: 'loc-2', name: '안방 옷장', type: 'closet', icon: '👕' },
  { id: 'loc-3', name: '거실 서랍장', type: 'drawer', icon: '🗄️' },
];

export const getLocations = (): Location[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(initialLocations));
    return initialLocations;
  }
  return JSON.parse(stored);
};

export const saveLocation = (location: Location) => {
  const locations = getLocations();
  const existingIndex = locations.findIndex((l) => l.id === location.id);
  if (existingIndex >= 0) {
    locations[existingIndex] = location;
  } else {
    locations.push(location);
  }
  localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
};

export const deleteLocation = (locationId: string) => {
  let locations = getLocations();
  locations = locations.filter(l => l.id !== locationId);
  localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));

  // Also delete items in this location to prevent orphans
  const items = getItems().filter(i => i.locationId !== locationId);
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
};

export const getItems = (): Item[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.ITEMS);
  return stored ? JSON.parse(stored) : [];
};

export const saveItem = (item: Item) => {
  const items = getItems();
  const existingIndex = items.findIndex((i) => i.id === item.id);
  if (existingIndex >= 0) {
    items[existingIndex] = item;
  } else {
    items.push(item);
  }
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
};

export const deleteItem = (itemId: string) => {
  const items = getItems().filter((i) => i.id !== itemId);
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
};