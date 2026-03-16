import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Copy, CheckCircle2, UserCircle, Phone, Mail, Shield, Briefcase, Calendar, AlertTriangle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { StaffMember, mockStaff } from "@/types/staff";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function StaffProfile() {
  const navigate = useNavigate();
  const { staffId } = useParams();
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [copied, setCopied] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [removeReason, setRemoveReason] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("qrx_staff_list");
    const list: StaffMember[] = saved ? JSON.parse(saved) : mockStaff;
    const found = list.find((s) => s.id === staffId);
    setStaff(found || null);
  }, [staffId]);

  const handleCopyCode = () => {
    if (!staff?.staffCode) return;
    navigator.clipboard.writeText(staff.staffCode);
    setCopied(true);
    toast({ title: "Copied!", description: "Staff code copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRemoveStaff = () => {
    if (!removeReason.trim()) {
      toast({ title: "Reason required", description: "Please enter a reason for removal.", variant: "destructive" });
      return;
    }

    const saved = localStorage.getItem("qrx_staff_list");
    const list: StaffMember[] = saved ? JSON.parse(saved) : mockStaff;

    // Soft-delete: mark as removed but keep record
    const updated = list.map((s) =>
      s.id === staffId
        ? { ...s, removed: true, removedAt: new Date().toISOString(), removeReason: removeReason.trim() }
        : s
    );
    localStorage.setItem("qrx_staff_list", JSON.stringify(updated));

    toast({ title: "Staff Removed", description: `${staff?.name} has been removed from active staff.` });
    navigate("/staff-management");
  };

  if (!staff) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Staff Profile" />
        <div className="px-4 py-16 text-center text-muted-foreground">
          <p>Staff member not found.</p>
          <Button variant="ghost" className="mt-4" onClick={() => navigate("/staff-management")}>
            Back to My Staffs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Staff Profile" />
      <div className="px-4 py-5 max-w-2xl mx-auto">
        <Button variant="ghost" size="sm" className="mb-4 gap-1.5" onClick={() => navigate("/staff-management")}>
          <ArrowLeft className="h-4 w-4" />
          Back to My Staffs
        </Button>

        {/* Profile Header */}
        <Card className="mb-4">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border">
                <UserCircle className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold text-foreground truncate">{staff.name}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{staff.department}</p>
                {staff.customRole && (
                  <p className="text-xs text-muted-foreground mt-0.5 italic">{staff.customRole}</p>
                )}
                <div className="mt-2">
                  <LinkStatusBadge status={staff.linkStatus} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Staff Code */}
        {staff.staffCode && (
          <Card className="mb-4">
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Staff Code</p>
              <div className="flex items-center justify-between bg-muted rounded-lg py-3 px-4">
                <span className="text-xl font-mono font-bold tracking-widest text-foreground">{staff.staffCode}</span>
                <Button variant="ghost" size="sm" className="gap-1.5 shrink-0" onClick={handleCopyCode}>
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              {staff.codeGeneratedAt && (
                <p className="text-xs text-muted-foreground mt-2">
                  Generated on {formatDate(staff.codeGeneratedAt)}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Contact Information */}
        <Card className="mb-4">
          <CardContent className="p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact Information</p>

            <InfoRow icon={<Phone className="h-4 w-4" />} label="Mobile Number" value={staff.mobile || "—"} />
            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email ID" value={staff.email || "—"} />
          </CardContent>
        </Card>

        {/* Identity & Employment */}
        <Card className="mb-4">
          <CardContent className="p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Identity & Employment</p>

            <InfoRow icon={<Shield className="h-4 w-4" />} label="Government ID" value={staff.govIdType || "—"} />
            <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Department / Role" value={staff.department || "—"} />
            {staff.customRole && (
              <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Role Description" value={staff.customRole} />
            )}
            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date of Appointment" value={formatDate(staff.appointmentDate)} />
            <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Employment Type" value={staff.employmentType || "—"} />
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="mb-4">
          <CardContent className="p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Emergency Contact</p>

            <InfoRow icon={<UserCircle className="h-4 w-4" />} label="Contact Name" value={staff.emergencyName || "—"} />
            <InfoRow icon={<Phone className="h-4 w-4" />} label="Contact Phone" value={staff.emergencyPhone || "—"} />
          </CardContent>
        </Card>

        <Separator className="my-6" />

        {/* Remove Staff */}
        {!showRemove ? (
          <Button
            variant="destructive"
            className="w-full gap-2"
            onClick={() => setShowRemove(true)}
          >
            <AlertTriangle className="h-4 w-4" />
            Remove Staff
          </Button>
        ) : (
          <Card className="border-destructive/30">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-semibold">Remove {staff.name}?</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                This will remove the staff member from your active list. Internal records will be preserved.
              </p>

              <div className="space-y-1.5">
                <Label htmlFor="removeReason">
                  Reason <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="removeReason"
                  placeholder="e.g. Resigned, Contract ended, Terminated…"
                  value={removeReason}
                  onChange={(e) => setRemoveReason(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowRemove(false);
                    setRemoveReason("");
                  }}
                >
                  Cancel
                </Button>
                <Button variant="destructive" className="flex-1" onClick={handleRemoveStaff}>
                  Confirm Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="h-8" />
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground break-words">{value}</p>
      </div>
    </div>
  );
}

function LinkStatusBadge({ status }: { status: "linked" | "not_linked" }) {
  if (status === "linked") {
    return (
      <Badge variant="outline" className="gap-1.5 border-green-500/30 text-green-700 bg-green-50 dark:bg-green-950/30 dark:text-green-400 text-xs">
        <span className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
        Linked Successfully
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
