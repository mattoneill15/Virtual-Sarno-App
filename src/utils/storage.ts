import { UserProfile, TreatmentProgress } from '@/types';

// Local Storage utilities
const STORAGE_KEYS = {
  USER_PROFILE: 'sarno_user_profile',
  TREATMENT_PROGRESS: 'sarno_treatment_progress',
  APP_SETTINGS: 'sarno_app_settings',
} as const;

// Local Storage functions
export const localStorage = {
  // User Profile
  saveUserProfile: (profile: UserProfile): void => {
    try {
      const serialized = JSON.stringify({
        ...profile,
        createdAt: profile.createdAt.toISOString(),
        lastActive: profile.lastActive.toISOString(),
        painHistory: {
          ...profile.painHistory,
          onsetDate: profile.painHistory.onsetDate.toISOString(),
        },
        tmsAssessment: {
          ...profile.tmsAssessment,
          assessmentDate: profile.tmsAssessment.assessmentDate.toISOString(),
        },
      });
      window.localStorage.setItem(STORAGE_KEYS.USER_PROFILE, serialized);
    } catch (error) {
      console.error('Failed to save user profile:', error);
    }
  },

  getUserProfile: (): UserProfile | null => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        lastActive: new Date(parsed.lastActive),
        painHistory: {
          ...parsed.painHistory,
          onsetDate: new Date(parsed.painHistory.onsetDate),
        },
        tmsAssessment: {
          ...parsed.tmsAssessment,
          assessmentDate: new Date(parsed.tmsAssessment.assessmentDate),
        },
      };
    } catch (error) {
      console.error('Failed to load user profile:', error);
      return null;
    }
  },

  // Treatment Progress
  saveTreatmentProgress: (progress: TreatmentProgress): void => {
    try {
      const serialized = JSON.stringify({
        ...progress,
        sessions: progress.sessions.map(session => ({
          ...session,
          date: session.date.toISOString(),
        })),
        milestones: progress.milestones.map(milestone => ({
          ...milestone,
          date: milestone.date.toISOString(),
        })),
        journalEntries: progress.journalEntries.map(entry => ({
          ...entry,
          date: entry.date.toISOString(),
        })),
      });
      window.localStorage.setItem(STORAGE_KEYS.TREATMENT_PROGRESS, serialized);
    } catch (error) {
      console.error('Failed to save treatment progress:', error);
    }
  },

  getTreatmentProgress: (): TreatmentProgress | null => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.TREATMENT_PROGRESS);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        sessions: parsed.sessions.map((session: any) => ({
          ...session,
          date: new Date(session.date),
        })),
        milestones: parsed.milestones.map((milestone: any) => ({
          ...milestone,
          date: new Date(milestone.date),
        })),
        journalEntries: parsed.journalEntries.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
        })),
      };
    } catch (error) {
      console.error('Failed to load treatment progress:', error);
      return null;
    }
  },

  // Clear all data
  clearAllData: (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        window.localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  },

  // Export data for backup
  exportData: (): string => {
    try {
      const data = {
        userProfile: localStorage.getUserProfile(),
        treatmentProgress: localStorage.getTreatmentProgress(),
        exportDate: new Date().toISOString(),
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      return '';
    }
  },

  // Import data from backup
  importData: (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.userProfile) {
        localStorage.saveUserProfile(data.userProfile);
      }
      if (data.treatmentProgress) {
        localStorage.saveTreatmentProgress(data.treatmentProgress);
      }
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  },
};

// IndexedDB utilities for large datasets (journal entries, detailed logs)
class IndexedDBManager {
  private dbName = 'SarnoAppDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('journalEntries')) {
          const journalStore = db.createObjectStore('journalEntries', {
            keyPath: 'id',
            autoIncrement: true,
          });
          journalStore.createIndex('userId', 'userId', { unique: false });
          journalStore.createIndex('date', 'date', { unique: false });
        }

        if (!db.objectStoreNames.contains('sessions')) {
          const sessionStore = db.createObjectStore('sessions', {
            keyPath: 'id',
            autoIncrement: true,
          });
          sessionStore.createIndex('userId', 'userId', { unique: false });
          sessionStore.createIndex('date', 'date', { unique: false });
        }
      };
    });
  }

  async saveJournalEntry(userId: string, entry: Omit<TreatmentProgress['journalEntries'][0], 'id'>): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['journalEntries'], 'readwrite');
      const store = transaction.objectStore('journalEntries');
      
      const entryWithUserId = {
        ...entry,
        userId,
        date: entry.date.toISOString(),
      };

      const request = store.add(entryWithUserId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getJournalEntries(userId: string): Promise<TreatmentProgress['journalEntries']> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['journalEntries'], 'readonly');
      const store = transaction.objectStore('journalEntries');
      const index = store.index('userId');
      
      const request = index.getAll(userId);
      request.onsuccess = () => {
        const entries = request.result.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
        }));
        resolve(entries);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async clearUserData(userId: string): Promise<void> {
    if (!this.db) await this.init();

    const stores = ['journalEntries', 'sessions'];
    
    for (const storeName of stores) {
      await new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const index = store.index('userId');
        
        const request = index.openCursor(userId);
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          } else {
            resolve();
          }
        };
        request.onerror = () => reject(request.error);
      });
    }
  }
}

export const indexedDB = new IndexedDBManager();
