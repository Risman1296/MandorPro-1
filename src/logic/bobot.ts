// Calculate percentage done based on completed vs total quantity
export function percentDone(qtyDone: number, qtyTotal: number): number {
  if (qtyTotal <= 0) return 0;
  return Math.min(100, Math.max(0, (qtyDone / qtyTotal) * 100));
}

// Calculate Earned Value for a specific WBS item
export function evItem(weightPct: number, percent: number): number {
  return (weightPct * percent) / 100;
}

// Calculate distributed weight based on EV progression
export function bobotDisalurkan(evAkhir: number, evMingguLalu: number): number {
  return Math.max(0, evAkhir - evMingguLalu);
}

// Calculate total EV for a unit from all WBS items
export function calculateUnitEV(items: Array<{
  weight_pct: number;
  qty_done: number;
  qty_total: number;
}>): { totalEV: number; itemDetails: Array<{ weight_pct: number; percent: number; ev: number; }> } {
  
  const itemDetails = items.map(item => {
    const percent = percentDone(item.qty_done, item.qty_total);
    const ev = evItem(item.weight_pct, percent);
    return {
      weight_pct: item.weight_pct,
      percent,
      ev
    };
  });

  const totalEV = itemDetails.reduce((sum, item) => sum + item.ev, 0);
  
  return { totalEV, itemDetails };
}

// Calculate Schedule Performance Index (SPI)
export function calculateSPI(earnedValue: number, plannedValue: number): number {
  if (plannedValue <= 0) return 0;
  return earnedValue / plannedValue;
}

// Calculate Cost Performance Index (CPI) 
export function calculateCPI(earnedValue: number, actualCost: number): number {
  if (actualCost <= 0) return 0;
  return earnedValue / actualCost;
}

// Get status based on progress percentage
export function getProgressStatus(percent: number): 'not_started' | 'in_progress' | 'completed' | 'delayed' {
  if (percent === 0) return 'not_started';
  if (percent >= 100) return 'completed';
  if (percent > 0 && percent < 50) return 'in_progress';
  return 'delayed'; // Can be customized based on schedule
}

// Weekly progress calculation
export function calculateWeeklyProgress(
  currentProgress: Array<{ wbs_id: string; percent_done: number; weight_pct: number; }>,
  previousProgress: Array<{ wbs_id: string; percent_done: number; weight_pct: number; }>
): { totalProgressDelta: number; itemDeltas: Array<{ wbs_id: string; delta: number; weight: number; }> } {
  
  const itemDeltas: Array<{ wbs_id: string; delta: number; weight: number; }> = [];
  
  for (const current of currentProgress) {
    const previous = previousProgress.find(p => p.wbs_id === current.wbs_id);
    const prevPercent = previous ? previous.percent_done : 0;
    const delta = Math.max(0, current.percent_done - prevPercent);
    
    itemDeltas.push({
      wbs_id: current.wbs_id,
      delta,
      weight: current.weight_pct
    });
  }
  
  const totalProgressDelta = itemDeltas.reduce((sum, item) => sum + (item.delta * item.weight / 100), 0);
  
  return { totalProgressDelta, itemDeltas };
}