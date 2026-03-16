import { PageHeader } from "@/components/shared/PageHeader";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { StaffMember, mockStaff } from "@/types/staff";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCircle, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getMonthsSinceJoining(appointmentDate: string) {
  const joined = new Date(appointmentDate);
  const now = new Date();
  const joinYear = joined.getFullYear();
  const joinMonth = joined.getMonth();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const years: { year: number; months: { index: number; name: string }[] }[] = [];

  for (let y = joinYear; y <= currentYear; y++) {
    const startM = y === joinYear ? joinMonth : 0;
    const endM = y === currentYear ? currentMonth : 11;
    const months: { index: number; name: string }[] = [];
    for (let m = startM; m <= endM; m++) {
      months.push({ index: m, name: MONTH_NAMES[m] });
    }
    if (months.length > 0) {
      years.push({ year: y, months });
    }
  }

  return years;
}

export default function StaffAttendance() {
  const { staffId } = useParams<{ staffId: string }>();
  const [staff, setStaff] = useState<StaffMember | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("qrx_staff_list");
    const list: StaffMember[] = saved ? JSON.parse(saved) : mockStaff;
    const found = list.find((s) => s.id === staffId) || null;
    setStaff(found);
  }, [staffId]);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const yearData = staff ? getMonthsSinceJoining(staff.appointmentDate) : [];
  const availableYears = yearData.map((y) => y.year);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[availableYears.length - 1]);
    }
  }, [availableYears, selectedYear]);

  const selectedYearData = yearData.find((y) => y.year === selectedYear);

  if (!staff) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Staff Attendance" />
        <div className="px-4 py-16 text-center text-muted-foreground">Staff not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Staff Attendance" />
      <div className="px-4 py-5 max-w-2xl mx-auto space-y-5">
        {/* Staff info header */}
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <UserCircle className="h-10 w-10 text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold text-foreground truncate">{staff.name}</p>
              <p className="text-sm text-muted-foreground">{staff.department}</p>
            </div>
          </CardContent>
        </Card>

        {/* Year selector */}
        <div className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
          <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Month grid 3x3 */}
        {selectedYearData && (
          <div className="grid grid-cols-3 gap-3">
            {selectedYearData.months.map((m) => {
              const isCurrent = selectedYear === currentYear && m.index === currentMonth;
              const isPrevious = (selectedYear === currentYear && m.index === currentMonth - 1) ||
                (currentMonth === 0 && selectedYear === currentYear - 1 && m.index === 11);

              return (
                <Card
                  key={m.index}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isCurrent
                      ? "ring-2 ring-primary border-primary bg-primary/5"
                      : isPrevious
                        ? "border-accent bg-accent/30"
                        : "border-border"
                  }`}
                >
                  <CardContent className="p-4 text-center">
                    <p className={`text-sm font-medium ${isCurrent ? "text-primary" : "text-foreground"}`}>
                      {m.name}
                    </p>
                    {isCurrent && (
                      <Badge className="mt-1.5 text-[10px] px-1.5 py-0">Current</Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!selectedYearData && (
          <p className="text-center text-muted-foreground py-8 text-sm">No attendance data for this year.</p>
        )}
      </div>
    </div>
  );
}
