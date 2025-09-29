import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { Card, Button, Input, SectionHeader, StatusBadge } from '@/src/ui/components';
import { theme } from '@/src/ui/theme';
import { insertUnitProgress } from '@/src/db/queries';
import { UNITS, getBlockList } from '@/src/data/units';
import { getCurrentDate, getCurrentTimestamp } from '@/src/utils/time';
import { generateId } from '@/src/utils/id';
import { percentDone } from '@/src/logic/bobot';
import { appendDelta } from '@/src/services/outbox';
import { saveProgressPhoto } from '@/src/services/photos';

// Helper function to get filtered units
const getFilteredUnits = (block: string) => {
  if (block === 'ALL') return UNITS;
  return UNITS.filter(unit => unit.block === block);
};

export default function ProgressForm() {
  const [unitId, setUnitId] = useState(UNITS[0]?.code || 'A/1');
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState('ALL');
  const [wbsId, setWbsId] = useState('WBS-GAL-001');
  const [qtyDone, setQtyDone] = useState('0');
  const [qtyTotal, setQtyTotal] = useState('100');
  const [notes, setNotes] = useState('');
  const [hasQC, setHasQC] = useState(false);
  const [loading, setLoading] = useState(false);

  const deviceId = 'MOBILE-001'; // Mock device ID
  const userId = 'USER-001'; // Mock user ID

  const calculatedPercent = percentDone(parseFloat(qtyDone) || 0, parseFloat(qtyTotal) || 1);

  const handleSave = async () => {
    if (!unitId || !wbsId) {
      Alert.alert('Error', 'Unit dan Item WBS harus diisi');
      return;
    }

    try {
      setLoading(true);
      const progressId = generateId();
      const now = getCurrentTimestamp();
      
      const progressData = {
        id: progressId,
        unit_id: unitId,
        wbs_id: wbsId,
        date: getCurrentDate(),
        qty_done: parseFloat(qtyDone) || 0,
        percent_done: calculatedPercent,
        has_qc: hasQC,
        created_by: userId,
        created_at: now,
        updated_at: now,
      };

      insertUnitProgress(progressData);
      
      // Add to sync outbox
      await appendDelta({
        ts: now,
        device: deviceId,
        op: 'UPSERT',
        table: 'unit_progress',
        pk: progressId,
        data: progressData,
      });

      Alert.alert(
        'Berhasil',
        'Progres berhasil disimpan. Tambah foto bukti?',
        [
          { text: 'Tidak', style: 'cancel' },
          { text: 'Ya, Ambil Foto', onPress: () => handleTakePhoto(progressId) },
        ]
      );

      // Reset form
      setQtyDone('0');
      setNotes('');
      setHasQC(false);
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan progres: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleTakePhoto = async (progressId: string) => {
    try {
      const photoId = await saveProgressPhoto(progressId, notes);
      Alert.alert('Berhasil', 'Foto bukti berhasil disimpan');
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan foto: ' + error);
    }
  };

  const getProgressStatus = () => {
    if (calculatedPercent === 0) return 'not_started';
    if (calculatedPercent >= 100) return 'completed';
    if (calculatedPercent >= 50) return 'on_track';
    return 'behind';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'on_track': return 'info';
      case 'behind': return 'warning';
      default: return 'danger';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.formCard}>
        <SectionHeader 
          title="Cek Progres Pekerjaan" 
          subtitle="Update progres item WBS per unit"
        />

        {/* Unit Picker */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Unit</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowUnitPicker(true)}
          >
            <Text style={styles.pickerButtonText}>{unitId}</Text>
            <Text style={styles.pickerArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        <Input
          label="Item WBS ID"
          value={wbsId}
          onChangeText={setWbsId}
          placeholder="Contoh: WBS-GAL-001"
        />

        <Input
          label="Qty Selesai"
          value={qtyDone}
          onChangeText={setQtyDone}
          keyboardType="numeric"
          placeholder="0"
        />

        <Input
          label="Qty Total"
          value={qtyTotal}
          onChangeText={setQtyTotal}
          keyboardType="numeric"
          placeholder="100"
        />

        <Input
          label="Catatan (Opsional)"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          placeholder="Tambahkan catatan tentang progres..."
        />

        {/* Progress Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Ringkasan Progres</Text>
            <StatusBadge 
              status={getStatusColor(getProgressStatus())}
              text={`${calculatedPercent.toFixed(1)}%`} 
            />
          </View>
          
          <View style={styles.summaryDetails}>
            <Text style={styles.summaryText}>
              Qty: {qtyDone} / {qtyTotal}
            </Text>
            <Text style={styles.summaryText}>
              Status: {getProgressStatus().replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </Card>

        <View style={styles.qcSection}>
          <Button
            title={hasQC ? "✓ QC Approved" : "Mark QC Approved"}
            onPress={() => setHasQC(!hasQC)}
            variant={hasQC ? "success" : "secondary"}
            size="small"
          />
        </View>

        <Button
          title={loading ? "Menyimpan..." : "Simpan Progres"}
          onPress={handleSave}
          variant="primary"
          disabled={loading}
        />
      </Card>

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <SectionHeader title="Aksi Cepat" />
        <View style={styles.actionButtons}>
          <Button
            title="Foto Bukti"
            onPress={() => handleTakePhoto('temp')}
            variant="warning"
            size="small"
            style={styles.actionButton}
          />
          <Button
            title="Reset Form"
            onPress={() => {
              setQtyDone('0');
              setNotes('');
              setHasQC(false);
            }}
            variant="secondary"
            size="small"
            style={styles.actionButton}
          />
        </View>
      </Card>

      {/* Mock Data Info */}
      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>Info Pengembangan</Text>
        <Text style={styles.infoText}>
          Data unit dan WBS masih menggunakan mock data. 
          Dalam implementasi penuh, akan terintegrasi dengan database master.
        </Text>
      </Card>

      {/* Unit Picker Modal */}
      <Modal
        visible={showUnitPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUnitPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pilih Unit</Text>
            
            {/* Block Filter */}
            <View style={styles.blockFilter}>
              <TouchableOpacity
                style={[styles.blockButton, selectedBlock === 'ALL' && styles.blockButtonActive]}
                onPress={() => setSelectedBlock('ALL')}
              >
                <Text style={[
                  styles.blockButtonText, 
                  selectedBlock === 'ALL' && styles.blockButtonTextActive
                ]}>
                  Semua ({UNITS.length})
                </Text>
              </TouchableOpacity>
              {getBlockList().map(block => (
                <TouchableOpacity
                  key={block}
                  style={[styles.blockButton, selectedBlock === block && styles.blockButtonActive]}
                  onPress={() => setSelectedBlock(block)}
                >
                  <Text style={[
                    styles.blockButtonText,
                    selectedBlock === block && styles.blockButtonTextActive
                  ]}>
                    Blok {block}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Unit List */}
            <FlatList
              data={UNITS.filter(unit => selectedBlock === 'ALL' || unit.block === selectedBlock)}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.unitItem}
                  onPress={() => {
                    setUnitId(item.code);
                    setShowUnitPicker(false);
                  }}
                >
                  <Text style={styles.unitCode}>{item.code}</Text>
                  <Text style={styles.unitBlock}>Blok {item.block}</Text>
                </TouchableOpacity>
              )}
            />

            <Button
              title="Tutup"
              onPress={() => setShowUnitPicker(false)}
              variant="secondary"
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  formCard: {
    margin: theme.spacing.lg,
  },
  summaryCard: {
    backgroundColor: theme.colors.gray[50],
    marginVertical: theme.spacing.md,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  summaryTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
  },
  summaryDetails: {
    gap: theme.spacing.xs,
  },
  summaryText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
  },
  qcSection: {
    marginVertical: theme.spacing.md,
  },
  actionsCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  infoCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
    backgroundColor: theme.colors.warning[50],
  },
  infoTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.warning[700],
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.warning[600],
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    backgroundColor: '#FFFFFF',
  },
  pickerButtonText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text.primary,
  },
  pickerArrow: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.gray[500],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  blockFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  blockButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
    backgroundColor: '#FFFFFF',
  },
  blockButtonActive: {
    backgroundColor: theme.colors.primary[100],
    borderColor: theme.colors.primary[500],
  },
  blockButtonText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
  },
  blockButtonTextActive: {
    color: theme.colors.primary[700],
    fontWeight: theme.typography.fontWeights.medium,
  },
  unitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  unitCode: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text.primary,
    flex: 1,
  },
  unitBlock: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.md,
  },
});