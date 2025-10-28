import { PageHeader } from "@/components/shared/PageHeader";

export default function MasterPause() {
  return (
    <div>
      <PageHeader title="Master Pause" />
      <div className="p-6">
        <p className="text-muted-foreground">Pause all orders temporarily</p>
      </div>
    </div>
  );
}
