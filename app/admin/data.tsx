import { Redirect } from 'expo-router';

// Redirect shim for legacy route -> new query-based admin data tab
export default function AdminDataRedirect() {
  return <Redirect href="/admin?tab=data" />;
}