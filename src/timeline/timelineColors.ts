export const statusColor = { TODO:'#94a3b8', DOING:'#60a5fa', DONE:'#22c55e' } as const;
export function progressOverlay(width:number, pct=0){ return Math.max(0, Math.floor(width * pct/100)); }
