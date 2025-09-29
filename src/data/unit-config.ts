// Unit Configuration - Easy bulk updates
// Update pattern ini untuk generate units baru

export const UNIT_CONFIG = {
  // Pattern untuk generate units otomatis
  // Format: "BLOCK/START-BLOCK/END" dipisah koma
  defaultPattern: "A/1-A/20, B/1-B/30, C/1-C/25, D/1-D/15",
  
  // Atau bisa pakai config individual per blok
  blockConfig: [
    { block: 'A', startNum: 1, endNum: 20 },  // A/1 sampai A/20 
    { block: 'B', startNum: 1, endNum: 30 },  // B/1 sampai B/30
    { block: 'C', startNum: 1, endNum: 25 },  // C/1 sampai C/25
    { block: 'D', startNum: 1, endNum: 15 },  // D/1 sampai D/15
  ],
  
  // Config tambahan
  settings: {
    // Prefix untuk kode unit (optional)
    prefix: '',
    
    // Format separator (default: "/")  
    separator: '/',
    
    // Zero padding untuk nomor (contoh: A/001 vs A/1)
    zeroPadding: false,
    padLength: 3,
  }
};

// Helper function untuk convert blockConfig ke pattern string
export function blockConfigToPattern(blockConfig: typeof UNIT_CONFIG.blockConfig): string {
  return blockConfig
    .map(config => `${config.block}/${config.startNum}-${config.block}/${config.endNum}`)
    .join(', ');
}

// Helper function untuk generate dari blockConfig
export function generateFromBlockConfig(blockConfig: typeof UNIT_CONFIG.blockConfig, settings = UNIT_CONFIG.settings) {
  const units = [];
  
  for (const config of blockConfig) {
    for (let i = config.startNum; i <= config.endNum; i++) {
      const number = settings.zeroPadding ? 
        i.toString().padStart(settings.padLength, '0') : 
        i.toString();
      
      const code = `${settings.prefix}${config.block}${settings.separator}${number}`;
      
      units.push({
        code,
        block: config.block,
        number: number
      });
    }
  }
  
  return units;
}

// Quick generators untuk pola umum
export const QUICK_PATTERNS = {
  // Apartemen kecil
  smallApartment: "A/1-A/10, B/1-B/10",
  
  // Apartemen sedang  
  mediumApartment: "A/1-A/20, B/1-B/20, C/1-C/20",
  
  // Apartemen besar
  largeApartment: "A/1-A/30, B/1-B/30, C/1-C/30, D/1-D/30",
  
  // Ruko/townhouse
  shophouse: "R/1-R/50",
  
  // Villa/single house
  villa: "V/1-V/25",
  
  // Mixed development  
  mixed: "A/1-A/20, B/1-B/15, R/1-R/30, V/1-V/10",
};

export default UNIT_CONFIG;