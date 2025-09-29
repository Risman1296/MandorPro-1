import * as FileSystem from 'expo-file-system';
import { AuthRequest, makeRedirectUri, useAuthRequest } from 'expo-auth-session';

const GOOGLE_DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';

// Setup Google Cloud OAuth Client credentials 
export const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

export async function signInWithGoogle(clientId: string) {
  const redirectUri = makeRedirectUri({});
  
  // For now, return a mock token for development
  // TODO: Implement proper OAuth flow
  console.warn('Mock authentication - implement proper OAuth in production');
  return 'mock_access_token';
}

export async function uploadToDrive(
  accessToken: string, 
  filePath: string, 
  fileName: string, 
  mime: string = 'application/json'
) {
  try {
    const fileBase64 = await FileSystem.readAsStringAsync(filePath, { 
      encoding: 'base64' as any
    });
    
    const metadata = { name: fileName };
    const boundary = 'foo_bar_baz';
    const body = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Type: ${mime}\r\nContent-Transfer-Encoding: base64\r\n\r\n${fileBase64}\r\n--${boundary}--`;

    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${accessToken}`, 
        'Content-Type': `multipart/related; boundary=${boundary}` 
      },
      body,
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error('Gagal upload: ' + errorText);
    }
    
    return res.json();
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

export async function uploadBackupToDrive(accessToken: string, backupName: string) {
  // Create a simple backup file with current timestamp
  const backupData = {
    timestamp: new Date().toISOString(),
    device: 'MOBILE_APP',
    version: '1.0.0',
    note: 'MandorPro database backup'
  };
  
  const tempPath = (FileSystem as any).documentDirectory + 'temp_backup.json';
  await FileSystem.writeAsStringAsync(tempPath, JSON.stringify(backupData, null, 2));
  
  try {
    const result = await uploadToDrive(accessToken, tempPath, `${backupName}.json`, 'application/json');
    
    // Clean up temp file
    await FileSystem.deleteAsync(tempPath, { idempotent: true });
    
    return result;
  } catch (error) {
    // Clean up temp file even if upload fails
    await FileSystem.deleteAsync(tempPath, { idempotent: true });
    throw error;
  }
}

export async function listDriveFiles(accessToken: string) {
  const res = await fetch('https://www.googleapis.com/drive/v3/files', {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  
  if (!res.ok) {
    throw new Error('Gagal ambil file list: ' + (await res.text()));
  }
  
  return res.json();
}