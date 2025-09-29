// Unit System Demo & Testing
// Contoh penggunaan sistem unit untuk berbagai keperluan

import { UNITS, generateUnits, generateUnitsQuick, getUnitsByBlock, getBlockList } from '@/src/data/units';

console.log('=== UNIT SYSTEM DEMO ===\n');

// 1. Default units yang sudah terbuat
console.log('1. Default Units:');
console.log(`   Total units: ${UNITS.length}`);
console.log(`   Blocks: ${getBlockList().join(', ')}`);
console.log(`   Sample units: ${UNITS.slice(0, 5).map(u => u.code).join(', ')}\n`);

// 2. Generate units dengan pattern custom
console.log('2. Custom Pattern Generation:');
const customUnits = generateUnits("X/100-X/110, Y/200-Y/205");
console.log(`   Pattern: "X/100-X/110, Y/200-Y/205"`);
console.log(`   Generated: ${customUnits.map(u => u.code).join(', ')}\n`);

// 3. Quick generation untuk banyak blok
console.log('3. Quick Generation:');
const quickUnits = generateUnitsQuick(['E', 'F'], 5);
console.log(`   Blocks: E, F with 5 units each`);
console.log(`   Generated: ${quickUnits.map(u => u.code).join(', ')}\n`);

// 4. Filter by block
console.log('4. Filter by Block:');
const blockAUnits = getUnitsByBlock('A');
console.log(`   Block A units (first 10): ${blockAUnits.slice(0, 10).map(u => u.code).join(', ')}\n`);

// 5. Usage examples for different features
console.log('5. Usage Examples:\n');

// Payroll export
console.log('   PAYROLL EXPORT:');
const payrollRows = UNITS.slice(0, 5).map((unit, index) => ({
  no: index + 1,
  block: unit.code,
  unit: unit.code,
  total_hours: 8,
  rate: 150000
}));
console.log(`   ${JSON.stringify(payrollRows[0], null, 2)}`);

// Progress tracking
console.log('\n   PROGRESS TRACKING:');
const progressData = UNITS.slice(0, 3).map(unit => ({
  unit_id: unit.code,
  wbs_id: 'WBS-GAL-001', 
  qty_done: Math.floor(Math.random() * 100),
  qty_total: 100
}));
console.log(`   ${JSON.stringify(progressData[0], null, 2)}`);

// Material usage per unit
console.log('\n   MATERIAL USAGE:');
const materialUsage = UNITS.slice(0, 2).map(unit => ({
  unit_id: unit.code,
  material_id: 'MAT-001',
  qty_used: Math.floor(Math.random() * 10) + 1,
  date: new Date().toISOString().split('T')[0]
}));
console.log(`   ${JSON.stringify(materialUsage[0], null, 2)}`);

console.log('\n=== END DEMO ===');

// Export untuk testing
export {
  customUnits,
  quickUnits,
  payrollRows,
  progressData,
  materialUsage
};