import { captureRef } from 'react-native-view-shot';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export async function exportPNG(ref:any, name='timeline.png'){
  const uri = await captureRef(ref, { format:'png', quality:1 });
  await Sharing.shareAsync(uri, { dialogTitle: 'Bagikan Timeline' });
  return uri;
}
export async function exportPDF(html:string, name='timeline.pdf'){
  const { uri } = await Print.printToFileAsync({ html, base64:false });
  await Sharing.shareAsync(uri, { dialogTitle: 'Bagikan PDF' });
  return uri;
}
