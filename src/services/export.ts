import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { Platform } from 'react-native';

// Export data to Excel format
export async function exportExcel(
  sheets: Record<string, any[]>, 
  fileName: string
): Promise<string> {
  try {
    const workbook = XLSX.utils.book_new();
    
    for (const [sheetName, data] of Object.entries(sheets)) {
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    }
    
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'base64' });
    const fileUri = (FileSystem as any).documentDirectory + `${fileName}.xlsx`;
    
    await FileSystem.writeAsStringAsync(fileUri, wbout, {
      encoding: 'base64' as any,
    });
    
    // Share the file
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri);
    }
    
    return fileUri;
  } catch (error) {
    console.error('Excel export failed:', error);
    throw new Error('Gagal export Excel: ' + (error as Error).message);
  }
}

// Generic CSV/Excel helpers (web + native)

function csvEscape(v: unknown) {
  return '"' + String(v ?? '').replace(/"/g, '""') + '"';
}

function projectRowsWithColumns(rows: any[], columns?: { key: string; header?: string }[]) {
  if (!columns || !columns.length) return rows;
  const headerMap = Object.fromEntries(columns.map(c => [c.key, c.header ?? c.key]));
  return rows.map((r) => {
    const obj: Record<string, any> = {};
    for (const c of columns) obj[headerMap[c.key]] = r?.[c.key];
    return obj;
  });
}

export async function exportCsvTable(
  rows: any[],
  baseName: string,
  columns?: { key: string; header?: string }[],
): Promise<void | string> {
  const projected = projectRowsWithColumns(rows, columns);
  const headers = projected.length ? Object.keys(projected[0]) : (columns?.map(c => c.header ?? c.key) ?? []);
  const lines = [headers.join(',')].concat(
    projected.map((r) => headers.map((h) => csvEscape((r as any)[h])).join(','))
  );
  const csv = lines.join('\n');
  const filename = `${baseName}.csv`;

  if (Platform.OS === 'web') {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = (globalThis as any).document?.createElement?.('a');
    if (a) {
      a.href = url; a.download = filename; a.style.display = 'none';
      (globalThis as any).document.body.appendChild(a); a.click();
      (globalThis as any).document.body.removeChild(a);
    }
    URL.revokeObjectURL(url);
    return;
  }

  const fileUri = (FileSystem as any).cacheDirectory + filename;
  await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: (FileSystem as any).EncodingType.UTF8 });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', dialogTitle: 'Export CSV' });
  }
  return fileUri;
}

export async function exportExcelTable(
  rows: any[],
  baseName: string,
  sheetName: string = 'Sheet1',
  columns?: { key: string; header?: string }[],
): Promise<void | string> {
  const projected = projectRowsWithColumns(rows, columns);
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(projected);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const filename = `${baseName}.xlsx`;

  if (Platform.OS === 'web') {
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = (globalThis as any).document?.createElement?.('a');
    if (a) {
      a.href = url; a.download = filename; a.style.display = 'none';
      (globalThis as any).document.body.appendChild(a); a.click();
      (globalThis as any).document.body.removeChild(a);
    }
    URL.revokeObjectURL(url);
    return;
  }

  const base64 = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
  const fileUri = (FileSystem as any).cacheDirectory + filename;
  await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: (FileSystem as any).EncodingType.Base64 });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: 'Export Excel',
    });
  }
  return fileUri;
}

// Export data to PDF format
export async function exportPdf(
  html: string, 
  fileName: string
): Promise<string> {
  try {
    const { uri } = await Print.printToFileAsync({ html });
    const destUri = (FileSystem as any).documentDirectory + `${fileName}.pdf`;
    
    // Move the generated PDF to our desired location
    await FileSystem.moveAsync({ from: uri, to: destUri });
    
    // Share the PDF
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(destUri);
    }
    
    return destUri;
  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error('Gagal export PDF: ' + (error as Error).message);
  }
}

// Generate HTML template for weekly report
export function generateWeeklyReportHTML(data: {
  projectName: string;
  weekPeriod: string;
  progress: any[];
  attendance: any[];
  materials: any[];
  payroll: any[];
}): string {
  return `
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Laporan Mingguan - ${data.projectName}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin: 20px 0; }
        .section h2 { color: #333; border-bottom: 2px solid #333; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .summary { background-color: #f9f9f9; padding: 15px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Laporan Mingguan Konstruksi</h1>
        <h2>${data.projectName}</h2>
        <p>Periode: ${data.weekPeriod}</p>
      </div>
      
      <div class="section">
        <h2>Ringkasan Progres</h2>
        <table>
          <thead>
            <tr><th>Unit</th><th>Item WBS</th><th>Progres (%)</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${data.progress.map(item => `
              <tr>
                <td>${item.unit || '-'}</td>
                <td>${item.item || '-'}</td>
                <td>${item.percent || 0}%</td>
                <td>${item.status || 'In Progress'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="section">
        <h2>Kehadiran Pekerja</h2>
        <table>
          <thead>
            <tr><th>Nama</th><th>Skill</th><th>Hadir (Hari)</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${data.attendance.map(worker => `
              <tr>
                <td>${worker.name || '-'}</td>
                <td>${worker.skill || '-'}</td>
                <td>${worker.days || 0}</td>
                <td>${worker.status || 'Active'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="section">
        <h2>Material</h2>
        <table>
          <thead>
            <tr><th>Nama Material</th><th>Saldo</th><th>Satuan</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${data.materials.map(material => `
              <tr>
                <td>${material.name || '-'}</td>
                <td>${material.balance || 0}</td>
                <td>${material.uom || '-'}</td>
                <td>${material.status || 'OK'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="section">
        <h2>Gaji Mingguan</h2>
        <table>
          <thead>
            <tr><th>Nama</th><th>Hadir</th><th>Gaji Harian</th><th>Borongan</th><th>Selisih</th></tr>
          </thead>
          <tbody>
            ${data.payroll.map(pay => `
              <tr>
                <td>${pay.nama || '-'}</td>
                <td>${pay.hadir || 0}</td>
                <td>Rp ${(pay.harian || 0).toLocaleString('id-ID')}</td>
                <td>Rp ${(pay.borongan || 0).toLocaleString('id-ID')}</td>
                <td style="color: ${pay.selisih >= 0 ? 'green' : 'red'}">
                  Rp ${(pay.selisih || 0).toLocaleString('id-ID')}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="summary">
        <h3>Catatan</h3>
        <p>Laporan ini dihasilkan secara otomatis dari aplikasi MandorPro.</p>
        <p>Tanggal pembuatan: ${new Date().toLocaleDateString('id-ID')}</p>
      </div>
    </body>
    </html>
  `;
}

// Quick export functions for common reports
export async function exportWeeklyReport(data: {
  projectName: string;
  weekPeriod: string;
  progress: any[];
  attendance: any[];
  materials: any[];
  payroll: any[];
}, format: 'excel' | 'pdf' = 'excel'): Promise<string> {
  
  const fileName = `laporan_mingguan_${data.weekPeriod.replace(/[^a-zA-Z0-9]/g, '_')}`;
  
  if (format === 'excel') {
    return exportExcel({
      Progres: data.progress,
      Kehadiran: data.attendance,
      Material: data.materials,
      BandingGaji: data.payroll,
    }, fileName);
  } else {
    const html = generateWeeklyReportHTML(data);
    return exportPdf(html, fileName);
  }
}