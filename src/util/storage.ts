// Storage utilities
export type STORAGE_KEYS =
	| 'wordgame_state'
	| 'wordgame_stats'
	| 'wordgame_settings';

export const loadFromStorage = <T extends any>(key: STORAGE_KEYS, defaultValue: T): T => {
	try {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : defaultValue;
	} catch {
		return defaultValue;
	}
};

export const saveToStorage = (key: STORAGE_KEYS, value: any) => {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (e) {
		console.error('Storage error:', e);
	}
};

export const removeFromStorage = (key: STORAGE_KEYS): void => {
	localStorage.removeItem(key);
};
