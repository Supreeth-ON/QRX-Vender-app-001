import { PageHeader } from "@/components/shared/PageHeader";
import { useParams } from "react-router-dom";

export default function CounterDetails() {
  const { counterName } = useParams<{ counterName: string }>();

  return (
    <div>
      <PageHeader title={`${counterName} Details`} />
      <div className="p-6">
        <p className="text-muted-foreground">
          Counter details and management will be available here
        </p>
      </div>
    </div>
  );
}
