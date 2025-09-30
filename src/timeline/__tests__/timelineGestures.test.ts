import { dragResize } from '../timelineGestures';

describe('dragResize helper', () => {
  test('applies deltaX to start/due based on zoom day', () => {
    const calls:any[] = [];
    const onChange = (id:string, s:number, d:number) => calls.push({ id, s, d });
    const apply = dragResize(onChange);
    const origStart = Date.parse('2025-10-01T00:00:00Z');
    const origDue = Date.parse('2025-10-05T00:00:00Z');

    // pxPerDay for day zoom = colW.day (28) / 1 => 28 px/day
    apply('t1', 56, { zoom: 'day', viewStart: origStart, origStart, origDue }); // move 56px -> ~2 days
    expect(calls.length).toBe(1);
    expect(calls[0].id).toBe('t1');
    const diffDays = Math.round((calls[0].s - origStart) / (24*3600*1000));
    expect(diffDays).toBe(2);
  });
});
