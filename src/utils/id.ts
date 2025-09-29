import { v4 as uuidv4 } from 'uuid';

// Generate UUID for primary keys
export function generateId(): string {
  return uuidv4();
}

// Generate week code (e.g., W20241028 for week starting Oct 28, 2024)
export function generateWeekCode(date: Date = new Date()): string {
  const monday = new Date(date);
  const dayOfWeek = monday.getDay();
  const diff = monday.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  monday.setDate(diff);
  
  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, '0');
  const day = String(monday.getDate()).padStart(2, '0');
  
  return `W${year}${month}${day}`;
}

// Generate project code from name
export function generateProjectCode(projectName: string): string {
  const cleanName = projectName
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 6); // Take first 6 characters
    
  const timestamp = Date.now().toString().slice(-4);
  return `${cleanName}${timestamp}`;
}

// Generate unit code
export function generateUnitCode(block?: string, number?: string, typeCode?: string): string {
  const parts = [
    typeCode || 'U',
    block || 'BLK',
    number || '001'
  ].filter(Boolean);
  
  return parts.join('-').toUpperCase();
}

// Generate material code
export function generateMaterialCode(materialName: string): string {
  const cleanName = materialName
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(' ')
    .map(word => word.substring(0, 3).toUpperCase())
    .join('');
    
  const counter = Math.floor(Math.random() * 999) + 1;
  return `MAT-${cleanName}-${String(counter).padStart(3, '0')}`;
}

// Generate worker code
export function generateWorkerCode(workerName: string): string {
  const cleanName = workerName
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(' ')
    .map(word => word.substring(0, 2).toUpperCase())
    .join('');
    
  const counter = Math.floor(Math.random() * 99) + 1;
  return `WKR-${cleanName}-${String(counter).padStart(2, '0')}`;
}

// Generate reference number for transactions
export function generateReference(prefix: string = 'REF'): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const counter = Math.floor(Math.random() * 9999) + 1;
  
  return `${prefix}${year}${month}${day}${String(counter).padStart(4, '0')}`;
}

// Generate device ID for tracking
export function generateDeviceId(): string {
  const platform = 'MOB'; // Mobile
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 999) + 1;
  
  return `${platform}-${timestamp}-${String(random).padStart(3, '0')}`;
}