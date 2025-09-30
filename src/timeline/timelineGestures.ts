import { Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, withDecay } from 'react-native-reanimated';
import { clamp, DAY, colW } from './timelineMath';

export function usePanZoom({ width, maxX }: { width:number; maxX:number }) {
  const tx = useSharedValue(0);  // pan X (negative for right scroll)
  const scale = useSharedValue(1);

  const pan = Gesture.Pan()
    .onChange((e: { changeX: number }) => {
      tx.value = clamp(tx.value + e.changeX, -maxX, 0);
    })
    .onEnd((e: { velocityX: number }) => {
      tx.value = withDecay({ velocity: e.velocityX as number, clamp: [-maxX, 0] as [number, number] });
    });

  const pinch = Gesture.Pinch().onChange((e: { scaleChange: number }) => {
    const next = clamp(scale.value * (e.scaleChange ?? 1), 0.5, 3);
    scale.value = next;
  });

  return { tx, scale, gesture: Gesture.Simultaneous(pan, pinch) };
}

/**
 * Minimal helper to convert a horizontal drag (deltaX in pixels) into new start/due timestamps
 * and call onChange(id, newStart, newDue). This keeps logic simple and testable without
 * wiring low-level gesture handlers here.
 *
 * Usage: const applyDelta = dragResize(onChange); then call applyDelta(id, deltaX, { zoom, viewStart, origStart, origDue })
 */
export function dragResize(onChange: (id: string, start: number, due: number) => void) {
  return function applyDelta(
    id: string,
    deltaX: number,
    opts: { zoom: 'day' | 'week' | 'month'; viewStart: number; origStart: number; origDue: number }
  ) {
    const { zoom, viewStart, origStart, origDue } = opts;
    // pixels per day depends on zoom
    const pxPerUnit = colW[zoom];
    const unitDays = zoom === 'day' ? 1 : zoom === 'week' ? 7 : 30;
    const pxPerDay = pxPerUnit / unitDays;

    // Convert deltaX (pixels) to days (rounded)
    const daysDelta = Math.round(deltaX / pxPerDay);

    const newStart = origStart + daysDelta * DAY;
    const newDue = origDue + daysDelta * DAY;

    onChange(id, newStart, newDue);
  };
}
