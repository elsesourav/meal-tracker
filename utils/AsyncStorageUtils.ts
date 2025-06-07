import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
export const STORAGE_KEYS = {
   MEAL_DATA: "@meal_tracker_data",
   CUSTOM_VALUES: "@meal_tracker_custom_values",
} as const;

// Type definitions
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export interface StorageUtils {
   get: <T = any>(key: StorageKey) => Promise<T | null>;
   set: <T = any>(key: StorageKey, value: T) => Promise<void>;
   remove: (key: StorageKey) => Promise<void>;
   clear: () => Promise<void>;
   getAllKeys: () => Promise<readonly string[]>;
   multiGet: (keys: StorageKey[]) => Promise<[string, string | null][]>;
   multiSet: (keyValuePairs: [StorageKey, string][]) => Promise<void>;
   multiRemove: (keys: StorageKey[]) => Promise<void>;
}

class AsyncStorageService implements StorageUtils {
   /**
    * Get data from AsyncStorage
    * @param key Storage key
    * @returns Parsed data or null if not found
    */
   async get<T = any>(key: StorageKey): Promise<T | null> {
      try {
         const data = await AsyncStorage.getItem(key);
         if (data === null) {
            return null;
         }
         return JSON.parse(data) as T;
      } catch (error) {
         console.error(`Error getting data for key ${key}:`, error);
         return null;
      }
   }

   /**
    * Set data in AsyncStorage
    * @param key Storage key
    * @param value Data to store
    */
   async set<T = any>(key: StorageKey, value: T): Promise<void> {
      try {
         const jsonValue = JSON.stringify(value);
         await AsyncStorage.setItem(key, jsonValue);
         console.log(`✅ Data saved for key: ${key}`);
      } catch (error) {
         console.error(`Error setting data for key ${key}:`, error);
         throw error;
      }
   }

   /**
    * Remove data from AsyncStorage
    * @param key Storage key
    */
   async remove(key: StorageKey): Promise<void> {
      try {
         await AsyncStorage.removeItem(key);
         console.log(`✅ Data removed for key: ${key}`);
      } catch (error) {
         console.error(`Error removing data for key ${key}:`, error);
         throw error;
      }
   }

   /**
    * Clear all AsyncStorage data
    */
   async clear(): Promise<void> {
      try {
         await AsyncStorage.clear();
         console.log("✅ All AsyncStorage data cleared");
      } catch (error) {
         console.error("Error clearing AsyncStorage:", error);
         throw error;
      }
   }

   /**
    * Get all keys from AsyncStorage
    */
   async getAllKeys(): Promise<readonly string[]> {
      try {
         return await AsyncStorage.getAllKeys();
      } catch (error) {
         console.error("Error getting all keys:", error);
         return [];
      }
   }

   /**
    * Get multiple values at once
    * @param keys Array of storage keys
    */
   async multiGet(keys: StorageKey[]): Promise<[string, string | null][]> {
      try {
         const result = await AsyncStorage.multiGet(keys);
         return [...result] as [string, string | null][];
      } catch (error) {
         console.error("Error getting multiple values:", error);
         return [];
      }
   }

   /**
    * Set multiple values at once
    * @param keyValuePairs Array of [key, value] pairs
    */
   async multiSet(keyValuePairs: [StorageKey, string][]): Promise<void> {
      try {
         await AsyncStorage.multiSet(keyValuePairs);
         console.log("✅ Multiple values set successfully");
      } catch (error) {
         console.error("Error setting multiple values:", error);
         throw error;
      }
   }

   /**
    * Remove multiple keys at once
    * @param keys Array of storage keys
    */
   async multiRemove(keys: StorageKey[]): Promise<void> {
      try {
         await AsyncStorage.multiRemove(keys);
         console.log("✅ Multiple keys removed successfully");
      } catch (error) {
         console.error("Error removing multiple keys:", error);
         throw error;
      }
   }

   /**
    * Get meal data with proper typing
    */
   async getMealData(): Promise<any> {
      return this.get(STORAGE_KEYS.MEAL_DATA);
   }

   /**
    * Set meal data
    */
   async setMealData(data: any): Promise<void> {
      return this.set(STORAGE_KEYS.MEAL_DATA, data);
   }

   /**
    * Get custom values with proper typing
    */
   async getCustomValues(): Promise<string[] | null> {
      return this.get<string[]>(STORAGE_KEYS.CUSTOM_VALUES);
   }

   /**
    * Set custom values
    */
   async setCustomValues(values: string[]): Promise<void> {
      return this.set(STORAGE_KEYS.CUSTOM_VALUES, values);
   }

   /**
    * Clear all meal tracker data
    */
   async clearAllMealTrackerData(): Promise<void> {
      try {
         await this.multiRemove([
            STORAGE_KEYS.MEAL_DATA,
            STORAGE_KEYS.CUSTOM_VALUES,
         ]);
         console.log("✅ All meal tracker data cleared");
      } catch (error) {
         console.error("Error clearing meal tracker data:", error);
         throw error;
      }
   }
}

// Export singleton instance
export const AsyncStorageHelper = new AsyncStorageService();

// Export individual functions for convenience
export const {
   get: getFromStorage,
   set: setInStorage,
   remove: removeFromStorage,
   clear: clearStorage,
   getAllKeys,
   multiGet,
   multiSet,
   multiRemove,
} = AsyncStorageHelper;
