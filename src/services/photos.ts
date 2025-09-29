import * as Camera from 'expo-camera';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import { v4 as uuid } from 'uuid';

export interface PhotoResult {
  uri: string;
  lat?: number;
  lon?: number;
  taken_at: string;
}

export async function requestPermissions(): Promise<boolean> {
  try {
    // For now, return true for development
    // In production, implement proper permission handling
    console.warn('Mock permissions - implement proper camera permissions in production');
    return true;
  } catch (error) {
    console.error('Permission request failed:', error);
    return false;
  }
}

export async function capturePhoto(): Promise<PhotoResult> {
  const hasPermissions = await requestPermissions();
  if (!hasPermissions) {
    throw new Error('Izin kamera atau lokasi ditolak');
  }
  
  try {
    const taken_at = new Date().toISOString();
    
    // Get current location
    let lat: number | undefined;
    let lon: number | undefined;
    
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      lat = location.coords.latitude;
      lon = location.coords.longitude;
    } catch (error) {
      console.warn('Could not get location:', error);
    }
    
    // For development, create a placeholder image file
    // In production, this would use the actual Camera component
    const photoId = uuid();
    const photoUri = (FileSystem as any).documentDirectory + `photo_${photoId}.jpg`;
    
    // Create a placeholder file (in production, this would be the actual photo)
    await FileSystem.writeAsStringAsync(photoUri, 'PHOTO_PLACEHOLDER_DATA', {
      encoding: 'utf8' as any,
    });
    
    return {
      uri: photoUri,
      lat,
      lon,
      taken_at,
    };
  } catch (error) {
    console.error('Photo capture failed:', error);
    throw new Error('Gagal mengambil foto: ' + (error as Error).message);
  }
}

export async function saveProgressPhoto(
  unitProgressId: string,
  note?: string
): Promise<string> {
  const photo = await capturePhoto();
  const photoId = uuid();
  
  // In a real app, you would save this to the database
  // For now, just return the photo ID
  console.log('Saving progress photo:', {
    id: photoId,
    unit_progress_id: unitProgressId,
    uri: photo.uri,
    lat: photo.lat,
    lon: photo.lon,
    taken_at: photo.taken_at,
    note,
  });
  
  return photoId;
}

export async function saveDiaryPhoto(
  diaryId: string,
  note?: string
): Promise<string> {
  const photo = await capturePhoto();
  const photoId = uuid();
  
  // In a real app, you would save this to the database
  console.log('Saving diary photo:', {
    id: photoId,
    diary_id: diaryId,
    uri: photo.uri,
    lat: photo.lat,
    lon: photo.lon,
    taken_at: photo.taken_at,
    note,
  });
  
  return photoId;
}

export async function getPhotoInfo(uri: string): Promise<FileSystem.FileInfo> {
  return await FileSystem.getInfoAsync(uri);
}

export async function deletePhoto(uri: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch (error) {
    console.error('Failed to delete photo:', error);
  }
}