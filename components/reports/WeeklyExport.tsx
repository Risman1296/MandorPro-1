import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, TextInput } from 'react-native';
import dayjs from 'dayjs';
import { exportCsvTable, exportExcelTable } from '@/src/services/export';
import { getMaterialStock } from '@/src/db/queries/materials';

type Row = { id: string; name: string; unit?: string; total_in?: number; total_out?: number; balance?: number };

export default function WeeklyExport() {
	const [rows, setRows] = useState<Row[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [q, setQ] = useState('');

	useEffect(() => {
		let ok = true;
		(async () => {
			try {
				setLoading(true);
				const data = await getMaterialStock('DEMO');
				if (!ok) return;
				setRows((data ?? []).map((m: any) => ({
					id: String(m.id ?? m.code ?? m.name),
		  name: String(m.name ?? m.code ?? 'Material'),
		  unit: m.unit ?? m.uom,
		  total_in: Number(m.total_in ?? 0),
					total_out: Number(m.total_out ?? 0),
					balance: Number(m.balance ?? 0),
				})));
			} catch (e: any) {
				if (!ok) return;
				setError(e?.message ?? 'Gagal memuat data');
			} finally {
				if (ok) setLoading(false);
			}
		})();
		return () => { ok = false; };
	}, []);
	const filtered = useMemo(() => {
		const ql = q.trim().toLowerCase();
		return rows.filter(r => !ql || r.name.toLowerCase().includes(ql));
	}, [rows, q]);

	async function onExportCsv() {
		const base = `weekly-${dayjs().format('YYYY-[W]WW')}`;
		await exportCsvTable(filtered, base, [
	{ key: 'name', header: 'Material' },
	{ key: 'unit', header: 'Unit' },
	{ key: 'total_in', header: 'Masuk' },
			{ key: 'total_out', header: 'Keluar' },
			{ key: 'balance', header: 'Saldo' },
		]);
	}

	async function onExportXlsx() {
		const base = `weekly-${dayjs().format('YYYY-[W]WW')}`;
		await exportExcelTable(filtered, base, 'Weekly', [
	{ key: 'name', header: 'Material' },
	{ key: 'unit', header: 'Unit' },
	{ key: 'total_in', header: 'Masuk' },
			{ key: 'total_out', header: 'Keluar' },
			{ key: 'balance', header: 'Saldo' },
		]);
	}

	if (loading) return (
		<View style={{ padding: 16 }}>
			<ActivityIndicator />
			<Text style={{ color: '#64748b', marginTop: 8 }}>Menyiapkan export mingguan…</Text>
		</View>
	);
	if (error) return (
		<View style={{ padding: 16 }}>
			<Text style={{ color: '#b00020' }}>{error}</Text>
		</View>
	);

	return (
		<View style={{ gap: 10, padding: 12 }}>
			<Text style={{ fontSize: 16, fontWeight: '600' }}>Export Mingguan</Text>
			<TextInput
				placeholder="Cari material…"
				value={q}
				onChangeText={setQ}
				style={{ paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#e3e3e7', borderRadius: 8, maxWidth: 360 }}
			/>
			<View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
				<Pressable onPress={onExportCsv} style={btnStyle}>
					<Text style={btnTxt}>Export CSV</Text>
				</Pressable>
				<Pressable onPress={onExportXlsx} style={btnStyle}>
					<Text style={btnTxt}>Export Excel</Text>
				</Pressable>
			</View>
			<Text style={{ color: '#64748b' }}>Total: {filtered.length} material</Text>
		</View>
	);
}

const btnStyle = { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#dfe3ea', backgroundColor: 'white' };
const btnTxt = { fontWeight: '600' } as const;

