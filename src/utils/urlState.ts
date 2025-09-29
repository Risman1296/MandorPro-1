import { parse } from 'querystring';

export type UrlState = { section?: string; tab?: string; sub?: string };

export function readUrlState(loc: { pathname: string; search?: string }): UrlState {
  const pathname = loc.pathname || '/';
  const section = pathname.split('/').filter(Boolean)[0];
  const search = (loc.search || '').replace(/^\?/, '');
  const q = (parse(search) as Record<string, string | string[] | undefined>);
  const tab = typeof q.tab === 'string' ? q.tab : undefined;
  const sub = typeof q.sub === 'string' ? q.sub : undefined;
  return { section, tab, sub };
}

export function writeUrlState(n: Partial<UrlState>, base?: UrlState): string {
  const section = n.section ?? base?.section ?? '';
  const tab = n.tab ?? base?.tab;
  const sub = n.sub ?? base?.sub;
  const params = new URLSearchParams();
  if (tab) params.set('tab', tab);
  if (sub) params.set('sub', sub);
  const qs = params.toString();
  const path = `/${section || ''}`;
  return qs ? `${path}?${qs}` : path;
}
