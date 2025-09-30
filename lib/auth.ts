let session: { userId: string } | null = null;

export async function getSession() {
  // ganti dengan cek token/secure store/api milikmu
  await new Promise(r => setTimeout(r, 50));
  return session;
}

export function setSessionDemo(s: { userId: string } | null) {
  session = s;
}
