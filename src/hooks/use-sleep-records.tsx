
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type SleepRecord } from '@/components/SleepTracker';

interface SleepRecordStore {
  records: SleepRecord[];
  addRecord: (record: SleepRecord) => void;
  removeRecord: (index: number) => void;
  clearRecords: () => void;
}

// Create a store with Zustand
const useSleepRecordsStore = create<SleepRecordStore>()(
  persist(
    (set) => ({
      records: [],
      addRecord: (record) => 
        set((state) => ({ 
          records: [...state.records, { ...record }]
        })),
      removeRecord: (index) =>
        set((state) => ({
          records: state.records.filter((_, i) => i !== index)
        })),
      clearRecords: () => set({ records: [] })
    }),
    {
      name: 'sleep-records-storage',
      // Handle Date objects during serialization
      serialize: (state) => {
        return JSON.stringify({
          ...state,
          state: {
            ...state.state,
            records: state.state.records.map(record => ({
              ...record,
              date: record.date instanceof Date ? record.date.toISOString() : record.date
            }))
          }
        });
      },
      // Handle Date objects during deserialization
      deserialize: (str) => {
        const parsed = JSON.parse(str);
        return {
          ...parsed,
          state: {
            ...parsed.state,
            records: parsed.state.records.map((record: any) => ({
              ...record,
              date: new Date(record.date)
            }))
          }
        };
      }
    }
  )
);

// Export a hook that can be used in components
export const useSleepRecords = () => {
  const records = useSleepRecordsStore(state => state.records);
  const addRecord = useSleepRecordsStore(state => state.addRecord);
  const removeRecord = useSleepRecordsStore(state => state.removeRecord);
  const clearRecords = useSleepRecordsStore(state => state.clearRecords);

  return {
    records,
    addRecord,
    removeRecord,
    clearRecords
  };
};
