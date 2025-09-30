import { memo, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, FlatList, ScrollView } from 'react-native';
import { Svg, Rect, Text as SvgText, G, Defs, Marker, Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { TLRow, TLDep, TLMilestone } from './types';
import { useTimelineEngine } from './useTimelineEngine';
import { xAt, wOf, weekendBlocks, DAY } from './timelineMath';
import { statusColor, progressOverlay } from './timelineColors';
import { a11yLabel } from './timelineA11y';

type Props = {
  rows: TLRow[]; deps: TLDep[]; milestones: TLMilestone[];
  prefs?: Partial<import('./types').TLPrefs>;
  onEdit?: (id:string)=>void;
  onResize?: (id:string, start:number, due:number)=>void;
};

export default function TimelineView({ rows, deps, milestones, prefs, onEdit, onResize }: Props){
  const insets = useSafeAreaInsets(); const headerH = useHeaderHeight();
  const { ticks, width, todayX, prefs: P } = useTimelineEngine(rows, deps, milestones, prefs);
  const [hScroll, setHScroll] = useState(0);

  const titleW = 220; const rowH = 44; const gridH = rows.length * rowH + 40;

  // sinkronisasi scroll: header <-> body
  const headerRef = useRef<ScrollView>(null);
  const bodyHRef = useRef<ScrollView>(null);
  const onHScroll = (x:number)=>{
    setHScroll(x);
    headerRef.current?.scrollTo({ x, animated:false });
    bodyHRef.current?.scrollTo({ x, animated:false });
  };

  const Row = memo(({ item, index }: { item: TLRow; index: number })=>{
    const y = 40 + index * rowH;
    const x = xAt(item.startAt, Number(new Date(ticks[0]?.key||Date.now()).valueOf()), P.zoom);
    const w = wOf(item.startAt, item.dueAt, P.zoom);

    return (
      <G>
        {/* Bar */}
        <Rect x={x} y={y-16} width={w} height={16} rx={8} fill={statusColor[item.status ?? 'TODO']} />
        {/* Progress overlay */}
        <Rect x={x} y={y-16} width={progressOverlay(w, item.progress ?? 0)} height={16} rx={8} fill="rgba(0,0,0,0.2)" />
        {/* Title (sticky column) */}
        <Text style={{ position:'absolute', left: 12, top: y-22, width: titleW-24, fontWeight:'600' }}
              accessibilityLabel={a11yLabel(item)}
              numberOfLines={1}>
          {item.title}
        </Text>
      </G>
    );
  });

  const list = (
    <FlatList
      data={rows}
      keyExtractor={(r)=>r.id}
      getItemLayout={(_,i)=>({ length: rowH, offset: i*rowH, index: i })}
      renderItem={({ item, index })=> <Row item={item} index={index} />}
      initialNumToRender={20}
      windowSize={10}
      style={{ position:'absolute', left: titleW, top: 32 }}
    />
  );

  return (
    <View style={{ flex:1, paddingTop: headerH, paddingBottom: insets.bottom }}>
      {/* Toolbar */}
      <View style={{ padding:12, flexDirection:'row', gap:12, alignItems:'center' }}>
        <Text style={{ fontSize:18, fontWeight:'700' }}>Timeline</Text>
        <Pressable onPress={()=> onHScroll(todayX)}><Text>Hari Ini</Text></Pressable>
      </View>

      {/* Header sticky (tanggal) */}
      <ScrollView ref={headerRef} horizontal style={{ marginLeft: titleW }}>
        <Svg width={width} height={32}>
          {ticks.map((t,i)=> <SvgText key={i} x={t.x+2} y={22} fontSize="10">{t.label}</SvgText>)}
        </Svg>
      </ScrollView>

      <View style={{ flex:1, flexDirection:'row' }}>
        {/* Sticky title column */}
        <View style={{ width: titleW, borderRightWidth:1, borderColor:'#e5e7eb' }} />

        {/* Body: grid + bars; horizontal scroll tersinkron */}
        <ScrollView
          ref={bodyHRef}
          horizontal
          onScroll={(e)=> onHScroll(e.nativeEvent.contentOffset.x)}
          scrollEventThrottle={16}
          style={{ flex:1 }}
        >
          <Svg width={width} height={gridH}>
            {/* Grid vertikal */}
            {ticks.map((t,i)=> <Rect key={`g-${i}`} x={t.x} y={0} width={1} height={gridH} fill="#e5e7eb" />)}
            {/* Weekend shade (zoom day saja) */}
            {/* Simplified: use same start/end from ticks to shade weekends */}
            {/* Marker Hari Ini */}
            <Rect x={todayX} y={0} width={2} height={gridH} fill="#ef4444" />
          </Svg>

          {/* Bars & titles (virtualized) */}
          {list}

          {/* Placeholder for dependencies layer */}
          <Svg width={width} height={gridH} style={{ position:'absolute', left:0, top:0 }}>
            <Defs>
              <Marker id="arrow" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                <Path d="M0,0 L6,3 L0,6 z" fill="#6b7280" />
              </Marker>
            </Defs>
          </Svg>
        </ScrollView>
      </View>
    </View>
  );
}
