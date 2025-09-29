// Daftar Unit (blok & nomor saja)
// Generated automatically with unit generator

export interface Unit {
  code: string;
  block: string;
  number: string;
}

/**
 * Unit Generator - Generate units from range patterns
 * 
 * Examples:
 * - "A/1-A/20" generates A/1, A/2, ..., A/20
 * - "B/1-B/30, C/1-C/25" generates multiple ranges
 * - "D/1-D/10, E/15-E/25" generates with gaps
 * 
 * @param pattern Range pattern string
 * @returns Array of Unit objects
 */
export function generateUnits(pattern: string): Unit[] {
  const units: Unit[] = [];
  
  // Split by comma to handle multiple ranges
  const ranges = pattern.split(',').map(r => r.trim());
  
  for (const range of ranges) {
    // Parse pattern like "A/1-A/20"
    const match = range.match(/^([A-Z]+)\/(\d+)-([A-Z]+)\/(\d+)$/);
    
    if (!match) {
      console.warn(`Invalid unit range pattern: ${range}`);
      continue;
    }
    
    const [, startBlock, startNum, endBlock, endNum] = match;
    
    // Ensure same block for range
    if (startBlock !== endBlock) {
      console.warn(`Block mismatch in range: ${range}`);
      continue;
    }
    
    const block = startBlock;
    const start = parseInt(startNum);
    const end = parseInt(endNum);
    
    // Generate units in range
    for (let i = start; i <= end; i++) {
      const code = `${block}/${i}`;
      units.push({
        code,
        block,
        number: i.toString()
      });
    }
  }
  
  return units;
}

/**
 * Quick unit generator for common patterns
 */
export function generateUnitsQuick(blocks: string[], numbersPerBlock: number): Unit[] {
  const pattern = blocks
    .map(block => `${block}/1-${block}/${numbersPerBlock}`)
    .join(', ');
  
  return generateUnits(pattern);
}

// Default unit configuration - update this pattern as needed
const DEFAULT_PATTERN = "A/1-A/20, B/1-B/30, C/1-C/25, D/1-D/15";

// Generated units from default pattern
export const UNITS = generateUnits(DEFAULT_PATTERN);

// Export for easy access in code
export default UNITS;

// Helper functions for common operations
export const getUnitsByBlock = (block: string): Unit[] => {
  return UNITS.filter(unit => unit.block === block);
};

export const getBlockList = (): string[] => {
  return [...new Set(UNITS.map(unit => unit.block))].sort();
};

export const getTotalUnits = (): number => {
  return UNITS.length;
};

export const getUnitByCode = (code: string): Unit | undefined => {
  return UNITS.find(unit => unit.code === code);
};

// Usage examples:
/*
// Quick usage in payroll:
const payrollRows = UNITS.map((unit, index) => ({
  no: index + 1,
  block: unit.code,
  unit: unit.code
}));

// Get units by block:
const blockAUnits = getUnitsByBlock('A');

// Generate custom units:
const customUnits = generateUnits("X/100-X/150, Y/200-Y/250");

// Quick generation:
const quickUnits = generateUnitsQuick(['E', 'F', 'G'], 40);
*/