import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, UserCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { StaffMember, mockStaff } from "@/types/staff";

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
    const list: StaffMember[] = saved ? JSON.parse(saved) : mockStaff;
    return list.filter((s) => !s.removed);
  }, []);

  const [staff, setStaff] = useState<StaffMember[]>(loadStaff);

  useEffect(() => {
    const onFocus = () => setStaff(loadStaff());
    window.addEventListener("focus", onFocus);
    setStaff(loadStaff());
    return () => window.removeEventListener("focus", onFocus);
  }, [loadStaff]);

  const [search, setSearch] = useState("");

  const filtered = staff.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <Button size="sm" className="gap-1.5 shrink-0" onClick={() => navigate("/staff-management/new")}>
          <Plus className="h-4 w-4" />
          New Staff
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden sm:grid grid-cols-[1fr_1fr_auto_auto_auto] gap-3 px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span>Name</span>
        <span>Department</span>
        <span className="w-20 text-center">Attendance</span>
        <span className="w-24 text-center">Appointed</span>
        <span className="w-28 text-center">Link Status</span>
      </div>

      <div className="space-y-2.5">
        {filtered.map((s) => (
          <Card
            key={s.id}
            className="cursor-pointer transition-shadow hover:shadow-md active:shadow-sm border-border"
            onClick={() => navigate(`/staff-management/profile/${s.id}`)}
          >
            <CardContent className="p-4">
              {/* Desktop row */}
              <div className="hidden sm:grid grid-cols-[1fr_1fr_auto_auto_auto] gap-3 items-center">
                <div className="flex items-center gap-2.5">
                  <UserCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                  <span className="font-medium text-foreground truncate">{s.name}</span>
                </div>
                <span className="text-sm text-muted-foreground truncate">{s.department}</span>
                <div className="w-20 flex justify-center">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-3 text-xs border-primary/40 text-primary hover:bg-primary/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/staff-management/attendance/${s.id}`);
                    }}
                  >
                    Check
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground w-24 text-center">{formatDate(s.appointmentDate)}</span>
                <div className="w-28 flex justify-center">
                  <LinkStatusBadge status={s.linkStatus} />
                </div>
              </div>

              {/* Mobile row */}
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
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 px-2 text-[11px] border-primary/40 text-primary hover:bg-primary/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/staff-management/attendance/${s.id}`);
                    }}
                  >
                    Check
                  </Button>
                  <span>{formatDate(s.appointmentDate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <UserCircle className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">
            {search ? "No staff found matching your search." : <>No staff members yet. Tap <strong>New Staff +</strong> to add one.</>}
          </p>
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
