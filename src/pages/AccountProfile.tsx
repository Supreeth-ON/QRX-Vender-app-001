import { PageHeader } from "@/components/shared/PageHeader";

export default function AccountProfile() {
  return (
    <div>
      <PageHeader title="Account & Profile" />
      <div className="p-6">
        <p className="text-muted-foreground">Manage your account details</p>
      </div>
    </div>
  );
}
