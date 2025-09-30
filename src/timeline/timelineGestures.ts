import { Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, withDecay } from 'react-native-reanimated';
import { clamp } from './timelineMath';

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

export function dragResize(onChange:(id:string, start:number, due:number)=>void){
  return {} as any; // placeholder
}
