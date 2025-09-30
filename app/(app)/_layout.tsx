import { Redirect, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { getSession } from "../../lib/auth";

export default function AppLayout() {
  const [status, setStatus] = useState<"loading" | "in" | "out">("loading");

  useEffect(() => {
    (async () => {
      const s = await getSession();
      setStatus(s ? "in" : "out");
    })();
  }, []);

  if (status === "loading") return null; // jangan redirect saat belum siap
  if (status === "out") return <Redirect href="/(auth)/sign-in" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
