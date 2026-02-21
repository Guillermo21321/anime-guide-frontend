import { Suspense } from 'react';
import AdminClientPage from './admin-client-page';

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-300">Cargando panel...</div>}>
      <AdminClientPage />
    </Suspense>
  );
}
