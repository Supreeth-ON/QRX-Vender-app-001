import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

interface StaffMember {
  id: string;
  name: string;
  department: string;
  appointmentDate: string;
  linkStatus: "linked" | "not_linked";
}

const mockStaff: StaffMember[] = [
  { id: "1", name: "Rajesh Kumar", department: "Kitchen / Head Chef", appointmentDate: "2024-06-15", linkStatus: "linked" },
  { id: "2", name: "Priya Sharma", department: "Billing / Cashier", appointmentDate: "2024-09-01", linkStatus: "not_linked" },
  { id: "3", name: "Arun Patel", department: "Service / Waiter", appointmentDate: "2025-01-10", linkStatus: "linked" },
  { id: "4", name: "Meena Devi", department: "Kitchen / Cook", appointmentDate: "2025-02-20", linkStatus: "not_linked" },
  { id: "5", name: "Suresh Babu", department: "Service / Manager", appointmentDate: "2024-03-05", linkStatus: "linked" },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function StaffManagement() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Staff Management" />
      <div className="px-4 py-5 max-w-3xl mx-auto">
        <Tabs defaultValue="my-staffs">
          <TabsList className="w-full">
            <TabsTrigger value="my-staffs" className="flex-1">My Staffs</TabsTrigger>
          </TabsList>
          <TabsContent value="my-staffs" className="mt-4">
            <MyStaffsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function MyStaffsTab() {
  const navigate = useNavigate();
  const loadStaff = useCallback(() => {
    const saved = localStorage.getItem("qrx_staff_list");
    return saved ? JSON.parse(saved) : mockStaff;
  }, []);

  const [staff, setStaff] = useState<StaffMember[]>(loadStaff);

  useEffect(() => {
    const onFocus = () => setStaff(loadStaff());
    window.addEventListener("focus", onFocus);
    // Also reload when route changes back
    setStaff(loadStaff());
    return () => window.removeEventListener("focus", onFocus);
  }, [loadStaff]);

  return (
    <>
      <div className="flex items-center justify-end mb-4">
        <Button size="sm" className="gap-1.5" onClick={() => navigate("/staff-management/new")}>
          <Plus className="h-4 w-4" />
          New Staff
        </Button>
      </div>

      {/* Column headers */}
      <div className="hidden sm:grid grid-cols-[1fr_1fr_auto_auto] gap-3 px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span>Name</span>
        <span>Department</span>
        <span className="w-24 text-center">Appointed</span>
        <span className="w-28 text-center">Link Status</span>
      </div>

      <div className="space-y-2.5">
        {staff.map((s) => (
          <Card
            key={s.id}
            className="cursor-pointer transition-shadow hover:shadow-md active:shadow-sm border-border"
            onClick={() => navigate(`/staff-management/profile/${s.id}`)}
          >
            <CardContent className="p-4">
              <div className="hidden sm:grid grid-cols-[1fr_1fr_auto_auto] gap-3 items-center">
                <div className="flex items-center gap-2.5">
                  <UserCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                  <span className="font-medium text-foreground truncate">{s.name}</span>
                </div>
                <span className="text-sm text-muted-foreground truncate">{s.department}</span>
                <span className="text-sm text-muted-foreground w-24 text-center">{formatDate(s.appointmentDate)}</span>
                <div className="w-28 flex justify-center">
                  <LinkStatusBadge status={s.linkStatus} />
                </div>
              </div>

              <div className="sm:hidden space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                    <span className="font-medium text-foreground">{s.name}</span>
                  </div>
                  <LinkStatusBadge status={s.linkStatus} />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground pl-7">
                  <span>{s.department}</span>
                  <span>{formatDate(s.appointmentDate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {staff.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <UserCircle className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No staff members yet. Tap <strong>New Staff +</strong> to add one.</p>
        </div>
      )}
    </>
  );
}

function LinkStatusBadge({ status }: { status: "linked" | "not_linked" }) {
  if (status === "linked") {
    return (
      <Badge variant="outline" className="gap-1.5 border-green-500/30 text-green-700 bg-green-50 dark:bg-green-950/30 dark:text-green-400 text-xs">
        <span className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
        Linked
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1.5 border-blue-500/30 text-blue-700 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400 text-xs">
      <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
      Not Linked
    </Badge>
  );
}
