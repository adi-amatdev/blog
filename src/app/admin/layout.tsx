import { AdminSidebar } from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      <AdminSidebar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
