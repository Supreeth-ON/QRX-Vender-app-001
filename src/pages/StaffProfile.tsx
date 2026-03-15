import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function StaffProfile() {
  const navigate = useNavigate();
  const { staffId } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Staff Profile" />
      <div className="px-4 py-5 max-w-3xl mx-auto">
        <Button variant="ghost" size="sm" className="mb-4 gap-1.5" onClick={() => navigate("/staff-management")}>
          <ArrowLeft className="h-4 w-4" />
          Back to My Staffs
        </Button>
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">Staff Profile</p>
          <p className="text-sm mt-1">Staff ID: {staffId}</p>
          <p className="text-sm mt-4">Full profile details will be added in a future update.</p>
        </div>
      </div>
    </div>
  );
}
