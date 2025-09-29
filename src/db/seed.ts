import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

function parseCsv(text: string): string[][] {
  return text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(",").map((s) => s.trim()))
    .filter((row) => row.length > 0);
}

async function loadTextFromAsset(mod: any): Promise<string | null> {
  try {
    const asset = Asset.fromModule(mod);
    await asset.downloadAsync();
    const uri = asset.localUri ?? asset.uri;
    return await FileSystem.readAsStringAsync(uri, {
      encoding: (FileSystem as any).EncodingType.UTF8,
    });
  } catch {
    return null;
  }
}

export async function ensureSeededWith(
  run: (sql: string, params?: any[]) => Promise<any>,
  get: <T = any>(sql: string, params?: any[]) => Promise<T | undefined>
) {
  const seeded = await get<{ value: string }>("SELECT value FROM kv WHERE key='seed_v1';");
  if (seeded && (seeded as any).value === "1") return;

  // Seed materials from assets/data/materials.csv
  try {
    // @ts-ignore - packager resolves this
    const materialsCsv = await loadTextFromAsset(require("../../assets/data/materials.csv"));
    if (materialsCsv) {
      const rows = parseCsv(materialsCsv);
      const [header, ...data] = rows;
      const idx = (k: string) => header.indexOf(k);
      const idxName = idx("name");
      const idxUom = idx("uom");
      for (const r of data) {
        const name = r[idxName];
        if (!name) continue;
        const unit = idxUom >= 0 ? r[idxUom] : null;
        const scope = "DEMO";
        const id = `MAT-${Math.random().toString(36).slice(2, 9)}`;
        await run(
          `INSERT OR IGNORE INTO materials (id,name,unit,total_in,total_out,scope) VALUES (?,?,?,?,?,?);`,
          [id, name, unit, 0, 0, scope]
        );
      }
    }
  } catch {}

  // Seed workers from assets/data/labor_rates.csv
  try {
    // @ts-ignore - packager resolves this
    const laborCsv = await loadTextFromAsset(require("../../assets/data/labor_rates.csv"));
    if (laborCsv) {
      const rows = parseCsv(laborCsv);
      const [header, ...data] = rows;
      const idx = (k: string) => header.indexOf(k);
      const idxName = idx("name");
      const idxPrice = idx("price");
      for (const r of data) {
        const name = r[idxName];
        if (!name) continue;
        const rate = idxPrice >= 0 ? Number(r[idxPrice] || 0) : 0;
        const role = null;
        const scope = "DEMO";
        const id = `WRK-${Math.random().toString(36).slice(2, 9)}`;
        await run(
          `INSERT OR IGNORE INTO workers (id,name,role,rate,active,scope) VALUES (?,?,?,?,1,?);`,
          [id, name, role, rate, scope]
        );
      }
    }
  } catch {}

  await run("INSERT OR REPLACE INTO kv (key,value) VALUES ('seed_v1','1');");
}
// Minimal DEMO seed/wipe helpers compatible with schema.ts
import { run as runAdapter, get as getAdapter } from '@/src/db/adapters';

export async function ensureDemoSeed(force = false) {
  const row = await getAdapter<{ value: string }>("SELECT value FROM kv WHERE key='demo_seeded'");
  if (!force && row?.value === '1') return;

  await runAdapter(
    `INSERT OR IGNORE INTO materials (id,name,unit,total_in,total_out,scope)
     VALUES ('MAT-DEMO-SEMEN','Semen','sak',100,12,'DEMO')`
  );
  await runAdapter(
    `INSERT OR IGNORE INTO workers (id,name,role,rate,active,scope)
     VALUES ('WRK-DEMO-BUDI','Budi','Tukang',120000,1,'DEMO')`
  );
  await runAdapter(
    `INSERT OR IGNORE INTO projects (id,code,name,status,scope)
     VALUES ('PRJ-DEMO-001','PRJ-001','Renovasi Rumah A','active','DEMO')`
  );
  await runAdapter("INSERT OR REPLACE INTO kv (key,value) VALUES ('demo_seeded','1')");
}

export async function wipeDemoData() {
  await runAdapter(`DELETE FROM attendance WHERE scope='DEMO'`);
  await runAdapter(`DELETE FROM material_ledger WHERE scope='DEMO'`);
  await runAdapter(`DELETE FROM materials WHERE scope='DEMO'`);
  await runAdapter(`DELETE FROM workers WHERE scope='DEMO'`);
  await runAdapter(`DELETE FROM projects WHERE scope='DEMO'`);
  await runAdapter("INSERT OR REPLACE INTO kv (key,value) VALUES ('demo_seeded','0')");
}
// Database seeding utilities
import { Platform } from 'react-native';
import { getDB, initDB } from '@/src/db/index';
import { safeRunAsync, safeGetAllAsync } from '@/src/db/adapters';
import { generateId } from '@/src/utils/id';
import { getCurrentTimestamp } from '@/src/utils/time';

// Mock data untuk web platform
const mockMaterials = [
  ['name', 'unit', 'price_per_unit', 'min_stock', 'lead_time_days'],
  ['Semen Portland 50kg', 'sak', '65000', '50', '3'],
  ['Pasir Cor m3', 'm3', '350000', '10', '2'],
  ['Kerikil Split m3', 'm3', '400000', '8', '2'],
  ['Besi Beton 10mm', 'batang', '45000', '100', '7'],
  ['Bata Merah', 'buah', '800', '1000', '5']
];

const mockLaborRates = [
  ['position', 'daily_rate', 'overtime_multiplier'],
  ['Mandor', '150000', '1.5'],
  ['Tukang', '120000', '1.5'],
  ['Pekerja', '100000', '1.5']
];

const mockOtherCosts = [
  ['category', 'item_name', 'cost_per_unit', 'unit'],
  ['Transport', 'Sewa Truk', '500000', 'hari'],
  ['Equipment', 'Sewa Mesin Molen', '200000', 'hari'],
  ['Services', 'Upah Borongan Cor', '25000', 'm3']
];

// Helper function to simulate CSV reading
async function readAssetCSV(mockData: string[][]): Promise<string[][]> {
  if (Platform.OS === 'web') {
    // Use mock data for web
    return mockData;
  }
  
  // For mobile, you could implement actual file reading here
  return mockData;
}

// Helper function for SQL (simplified)
async function readAssetSQL(): Promise<string> {
  return ''; // Skip SQL import for now
}

// Import materials from CSV with pricing
async function importMaterialsFromCSV() {
  console.log('Importing materials from CSV...');

  try {
    const rows = await readAssetCSV(mockMaterials);
    if (rows.length < 2) return; // No data rows

    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      const [code_unique, code, name, uom, uom_raw, price, category] = rows[i];

      if (code && name) {
        const materialId = `MAT-${code}`;
        const priceNum = parseFloat(price) || 0;

        // Insert material with price
        await safeRunAsync(
          `INSERT OR REPLACE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES (?, ?, ?, ?, ?, ?)`,
          [materialId, code, name.trim(), uom || 'PCS', 10, 3]
        );

        console.log(`Imported material: ${code} - ${name} - ${priceNum}`);
      }
    }

    console.log('Materials imported successfully from CSV');
  } catch (error) {
    console.error('Failed to import materials from CSV:', error);
  }
}

// Import labor rates
async function importLaborRatesFromCSV() {
  console.log('Importing labor rates from CSV...');

  try {
    const rows = await readAssetCSV(mockLaborRates);
    if (rows.length < 2) return;

    for (let i = 1; i < rows.length; i++) {
      const [code_unique, code, name, uom, uom_raw, price] = rows[i];

      if (code && name) {
        const workerId = generateId();
        const dailyWage = parseFloat(price) || 100000;

        // Insert as worker with skill type
        await safeRunAsync(
          `INSERT OR REPLACE INTO workers (id, name, skill, daily_wage, phone, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [workerId, name.trim(), code, dailyWage, '', 1, getCurrentTimestamp(), getCurrentTimestamp()]
        );

        console.log(`Imported labor: ${code} - ${name} - ${dailyWage}`);
      }
    }

    console.log('Labor rates imported successfully');
  } catch (error) {
    console.error('Failed to import labor rates:', error);
  }
}

// Import other costs as materials with special category
async function importOtherCostsFromCSV() {
  console.log('Importing other costs from CSV...');

  try {
    const rows = await readAssetCSV(mockOtherCosts);
    if (rows.length < 2) return;

    for (let i = 1; i < rows.length; i++) {
      const [code_unique, code, name, uom, uom_raw, price] = rows[i];

      if (code && name) {
        const materialId = `COST-${code}`;

        // Insert as special material for other costs
        await safeRunAsync(
          `INSERT OR REPLACE INTO materials (id, code, name, uom, min_stock, lead_time_days) VALUES (?, ?, ?, ?, ?, ?)`,
          [materialId, code, `[OTHER] ${name.trim()}`, uom || 'LS', 0, 0]
        );

        console.log(`Imported other cost: ${code} - ${name}`);
      }
    }

    console.log('Other costs imported successfully');
  } catch (error) {
    console.error('Failed to import other costs:', error);
  }
}

// Import materials from SQL file (alternative method)
async function importMaterialsFromSQL() {
  console.log('Importing materials from SQL...');

  try {
    const sql = await readAssetSQL();
    if (!sql) return;

    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('BEGIN') && !stmt.startsWith('COMMIT') && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement) {
        await safeRunAsync(statement);
      }
    }

    console.log('Materials imported successfully from SQL');
  } catch (error) {
    console.error('Failed to import materials from SQL:', error);
  }
}

// Enhanced seed function with asset data
export async function seedDatabase() {
  console.log('Seeding database with asset data...');

  try {
    // Check if already seeded
    const projects = await safeGetAllAsync('SELECT COUNT(*) as count FROM projects') as any[];
    if (projects[0].count > 0) {
      console.log('Database already seeded');
      return;
    }

    const now = getCurrentTimestamp();

    // Seed basic project
    await safeRunAsync(
      'INSERT INTO projects (id, name, code, start_date, end_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['PROJECT-001', 'Perumahan Mandor Estate', 'PME-2024', '2024-01-01', '2024-12-31', now, now]
    );

    // Seed unit types
    await safeRunAsync(
      'INSERT OR REPLACE INTO unit_types (type_code, name) VALUES (?, ?)',
      ['T-36', 'Rumah Tipe 36']
    );
    await safeRunAsync(
      'INSERT OR REPLACE INTO unit_types (type_code, name) VALUES (?, ?)',
      ['T-45', 'Rumah Tipe 45']
    );

    // Seed some basic units
    const units = [
      { id: 'UNIT-A1-001', block: 'A1', number: '001', type_code: 'T-36' },
      { id: 'UNIT-A1-002', block: 'A1', number: '002', type_code: 'T-36' },
      { id: 'UNIT-B1-001', block: 'B1', number: '001', type_code: 'T-45' },
    ];

    for (const unit of units) {
      await safeRunAsync(
        'INSERT INTO units (id, project_id, block, number, type_code, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [unit.id, 'PROJECT-001', unit.block, unit.number, unit.type_code, 'active', now, now]
      );
    }

    // Import all asset data
    await importMaterialsFromCSV();
    await importLaborRatesFromCSV();
    await importOtherCostsFromCSV();

    // Alternative: import from SQL file (uncomment if needed)
    // await importMaterialsFromSQL();

    console.log('Database seeded successfully with all asset data!');
  } catch (error) {
    console.error('Failed to seed database:', error);
    throw error;
  }
}

// Simplified async version for compatibility
export async function seedDatabaseSync() {
  console.log('Seeding database (sync mode)...');

  try {
    const projects = await safeGetAllAsync('SELECT COUNT(*) as count FROM projects') as any[];
    if (projects[0]?.count > 0) {
      console.log('Database already seeded');
      return;
    }

    const now = getCurrentTimestamp();

    // Basic project setup
    await safeRunAsync(
      'INSERT INTO projects (id, name, code, start_date, end_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['PROJECT-001', 'Perumahan Mandor Estate', 'PME-2024', '2024-01-01', '2024-12-31', now, now]
    );

    await safeRunAsync(
      'INSERT OR REPLACE INTO unit_types (type_code, name) VALUES (?, ?)',
      ['T-36', 'Rumah Tipe 36']
    );

    console.log('Basic database seeded successfully (call seedDatabase() for full asset import)');
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
}
