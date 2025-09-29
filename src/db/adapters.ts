// Database Adapters - Web-friendly async operations
import { getDB } from '@/src/db/index';

// Database adapter that works on both web and native
class DatabaseAdapter {
  private async getDatabase() {
    const db = getDB();
    if (!db) {
      throw new Error('Database not initialized. Make sure to call initDB() first.');
    }
    return db;
  }

  // Generic query methods
  async getAllAsync(sql: string, params: any[] = []): Promise<any[]> {
    const db = await this.getDatabase();
    try {
      const result = await db.getAllAsync(sql, params);
      return result || [];
    } catch (error) {
      console.error('getAllAsync error:', error);
      return [];
    }
  }

  async getFirstAsync(sql: string, params: any[] = []): Promise<any | null> {
    const db = await this.getDatabase();
    try {
      const result = await db.getFirstAsync(sql, params);
      return result || null;
    } catch (error) {
      console.error('getFirstAsync error:', error);
      return null;
    }
  }

  async runAsync(sql: string, params: any[] = []): Promise<any> {
    const db = await this.getDatabase();
    try {
      const result = await db.runAsync(sql, params);
      return result;
    } catch (error) {
      console.error('runAsync error:', error);
      throw error;
    }
  }

  async execAsync(sql: string): Promise<void> {
    const db = await this.getDatabase();
    try {
      await db.execAsync(sql);
    } catch (error) {
      console.error('execAsync error:', error);
      throw error;
    }
  }

  // Transaction support
  async withTransactionAsync(fn: () => Promise<void>): Promise<void> {
    const db = await this.getDatabase();
    try {
      await db.withTransactionAsync(fn);
    } catch (error) {
      console.error('Transaction error:', error);
      throw error;
    }
  }
}

// Singleton instance
export const dbAdapter = new DatabaseAdapter();

// Mock data for web platform (fallback when DB is not available)
export const mockData = {
  projects: [
    { id: 'PRJ-001', name: 'Proyek Apartemen A', code: 'APT-A', status: 'active', created_at: '2024-01-01' }
  ],
  workers: [
    { id: 'WRK-001', name: 'Ahmad', skill: 'Tukang Batu', daily_wage: 150000, active: 1 },
    { id: 'WRK-002', name: 'Budi', skill: 'Tukang Kayu', daily_wage: 160000, active: 1 }
  ],
  tasks: [
    { id: 'TSK-001', project_id: 'PRJ-001', title: 'Persiapan Pondasi', status: 'in_progress', priority: 'high', created_at: '2024-01-01' },
    { id: 'TSK-002', project_id: 'PRJ-001', title: 'Pemasangan Bekisting', status: 'pending', priority: 'medium', created_at: '2024-01-02' }
  ],
  materials: [
    { id: 'MAT-001', name: 'Semen Portland', unit: 'sak', stock: 100, balance: 100 },
    { id: 'MAT-002', name: 'Pasir Cor', unit: 'm³', stock: 40, balance: 40 },
    { id: 'MAT-003', name: 'Kerikil Split', unit: 'm³', stock: 25, balance: 25 }
  ],
  units: [],
  attendance: [],
  progress: [],
};

// Determine appropriate mock data based on SQL query
function getMockDataForQuery(sql: string): any[] {
  const sqlLower = sql.toLowerCase();
  
  if (sqlLower.includes('materials') || sqlLower.includes('stock_ledger')) {
    return mockData.materials;
  } else if (sqlLower.includes('workers')) {
    return mockData.workers;
  } else if (sqlLower.includes('tasks')) {
    return mockData.tasks;
  } else if (sqlLower.includes('projects')) {
    return mockData.projects;
  } else if (sqlLower.includes('attendance')) {
    return mockData.attendance;
  } else if (sqlLower.includes('progress')) {
    return mockData.progress;
  }
  
  return [];
}

// Safe query methods with fallback to mock data
export async function safeGetAllAsync(sql: string, params: any[] = []): Promise<any[]> {
  try {
    const db = getDB();
    if (!db) {
      console.log('Using mock data for web platform');
      return getMockDataForQuery(sql);
    }
    return await dbAdapter.getAllAsync(sql, params);
  } catch (error) {
    console.warn('Database query failed, using mock data:', error);
    return getMockDataForQuery(sql);
  }
}

export async function safeGetFirstAsync(sql: string, params: any[] = []): Promise<any | null> {
  try {
    const db = getDB();
    if (!db) {
      console.log('Using mock data for web platform');
      const mockResults = getMockDataForQuery(sql);
      return mockResults.length > 0 ? mockResults[0] : null;
    }
    return await dbAdapter.getFirstAsync(sql, params);
  } catch (error) {
    console.warn('Database query failed, using mock data:', error);
    const mockResults = getMockDataForQuery(sql);
    return mockResults.length > 0 ? mockResults[0] : null;
  }
}

export async function safeRunAsync(sql: string, params: any[] = []): Promise<any> {
  try {
    const db = getDB();
    if (!db) {
      console.log('Skipping database operation on web platform');
      return { changes: 0, lastInsertRowId: 0 };
    }
    return await dbAdapter.runAsync(sql, params);
  } catch (error) {
    console.error('Database operation failed:', error);
    throw error;
  }
}

// Aliases to match simple helper naming used by seed/admin utilities
export const all = safeGetAllAsync;
export const get = async <T = any>(sql: string, params: any[] = []): Promise<T | undefined> => {
  const row = await safeGetFirstAsync(sql, params);
  return row as T | undefined;
};
export const run = safeRunAsync;