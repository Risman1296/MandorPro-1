import { seedDatabase, seedDatabaseSync } from '../db/seed';

/**
 * Utility script to manually import data from assets into database
 * This can be called from anywhere in the app to refresh/reimport data
 */

// Force reimport all data (clears existing data first)
export async function forceImportAssetData() {
  console.log('🔄 Force importing all asset data...');
  
  try {
    // Clear existing data (optional - uncomment if needed)
    // await clearAllData();
    
    // Import all asset data
    await seedDatabase();
    
    console.log('✅ Asset data imported successfully!');
    return true;
  } catch (error) {
    console.error('❌ Failed to import asset data:', error);
    return false;
  }
}

// Import only if database is empty
export async function safeImportAssetData() {
  console.log('🔍 Safe importing asset data...');
  
  try {
    await seedDatabase();
    console.log('✅ Safe import completed!');
    return true;
  } catch (error) {
    console.error('❌ Safe import failed:', error);
    return false;
  }
}

// Sync version for immediate use
export function importAssetDataSync() {
  console.log('⚡ Sync importing basic data...');
  
  try {
    seedDatabaseSync();
    console.log('✅ Sync import completed!');
    return true;
  } catch (error) {
    console.error('❌ Sync import failed:', error);
    return false;
  }
}

// Get import statistics
export async function getImportStats() {
  try {
    const { safeGetFirstAsync } = require('../db/adapters');
    
    const stats = {
      projects: (await safeGetFirstAsync('SELECT COUNT(*) as count FROM projects'))?.count || 0,
      materials: (await safeGetFirstAsync('SELECT COUNT(*) as count FROM materials'))?.count || 0,
      workers: (await safeGetFirstAsync('SELECT COUNT(*) as count FROM workers'))?.count || 0,
      units: (await safeGetFirstAsync('SELECT COUNT(*) as count FROM units'))?.count || 0,
    };
    
    console.log('📊 Import Statistics:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Failed to get import stats:', error);
    return { projects: 0, materials: 0, workers: 0, units: 0 };
  }
}

// Clear all data (use with caution!)
export async function clearAllData() {
  console.log('🗑️  Clearing all data...');
  
  try {
    const { db } = require('../db/database');
    
    // Clear in reverse dependency order
    db.runSync('DELETE FROM stock_ledger');
    db.runSync('DELETE FROM unit_progress');
    db.runSync('DELETE FROM attendance');
    db.runSync('DELETE FROM payroll_weeks');
    db.runSync('DELETE FROM site_diary');
    db.runSync('DELETE FROM workers');
    db.runSync('DELETE FROM materials');
    db.runSync('DELETE FROM units');
    db.runSync('DELETE FROM wbs_items');
    db.runSync('DELETE FROM unit_types');
    db.runSync('DELETE FROM projects');
    db.runSync('DELETE FROM sync_outbox');
    db.runSync('DELETE FROM audit_log');
    
    console.log('✅ All data cleared successfully!');
    return true;
  } catch (error) {
    console.error('❌ Failed to clear data:', error);
    return false;
  }
}