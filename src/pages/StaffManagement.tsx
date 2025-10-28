import { PageHeader } from "@/components/shared/PageHeader";

export default function StaffManagement() {
  return (
    <div>
      <PageHeader title="Staff Management" />
      <div className="p-6">
        <p className="text-muted-foreground">Manage your staff members and schedules</p>
      </div>
    </div>
  );
}
