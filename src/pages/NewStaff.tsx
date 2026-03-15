import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CalendarIcon, Camera, Upload, Copy, CheckCircle2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const govIdOptions = ["Aadhaar", "Voter ID", "Driving License", "Passport", "Others"];
const departmentOptions = ["Kitchen", "Main Counter", "Tea/Coffee Counter", "Chats Counter", "Manager", "Custom Role"];
const employmentOptions = ["Full Time", "Part Time", "Temporary"];

type Step = "form" | "otp" | "code";

function generateStaffCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "STF-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export default function NewStaff() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("form");

  // Form fields
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [govIdType, setGovIdType] = useState("");
  const [govIdFile, setGovIdFile] = useState<File | null>(null);
  const [staffPhoto, setStaffPhoto] = useState<File | null>(null);
  const [staffPhotoPreview, setStaffPhotoPreview] = useState<string | null>(null);
  const [govIdPreview, setGovIdPreview] = useState<string | null>(null);
  const [department, setDepartment] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [appointmentDate, setAppointmentDate] = useState<Date>(new Date());
  const [employmentType, setEmploymentType] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  // OTP
  const [mobileOtp, setMobileOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Staff code
  const [staffCode, setStaffCode] = useState("");
  const [copied, setCopied] = useState(false);

  const govIdInputRef = useRef<HTMLInputElement>(null);
  const govIdCameraRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const photoCameraRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (f: File | null) => void,
    setPreview: (p: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmAppointment = () => {
    if (!fullName.trim() || !mobile.trim() || !email.trim() || !govIdType || !govIdFile || !staffPhoto) {
      toast({ title: "Missing required fields", description: "Please fill all mandatory fields.", variant: "destructive" });
      return;
    }
    // Move to OTP step — mock OTP sent
    setStep("otp");
    toast({ title: "OTP Sent", description: `Verification codes sent to ${mobile} and ${email}.` });
  };

  const handleVerifyOtp = () => {
    if (mobileOtp.length < 4 || emailOtp.length < 4) {
      toast({ title: "Enter OTP", description: "Please enter both 4-digit OTP codes.", variant: "destructive" });
      return;
    }
    setVerifying(true);
    // Simulate verification delay
    setTimeout(() => {
      setVerifying(false);
      const code = generateStaffCode();
      setStaffCode(code);

      // Save staff to localStorage
      const saved = localStorage.getItem("qrx_staff_list");
      const list = saved ? JSON.parse(saved) : [];
      const newStaff = {
        id: crypto.randomUUID(),
        name: fullName.trim(),
        department: department === "Custom Role" ? customRole || "Custom Role" : department || "Unassigned",
        appointmentDate: format(appointmentDate, "yyyy-MM-dd"),
        linkStatus: "not_linked" as const,
        staffCode: code,
        codeGeneratedAt: new Date().toISOString(),
        mobile,
        email,
        govIdType,
        employmentType,
        emergencyName,
        emergencyPhone,
      };
      list.push(newStaff);
      localStorage.setItem("qrx_staff_list", JSON.stringify(list));

      setStep("code");
      toast({ title: "OTP Verified", description: "Staff member created successfully." });
    }, 1500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(staffCode);
    setCopied(true);
    toast({ title: "Copied!", description: "Staff code copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── OTP Screen ───
  if (step === "otp") {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="OTP Verification" />
        <div className="px-4 py-5 max-w-md mx-auto">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-semibold text-foreground">Verify OTP</h2>
                <p className="text-sm text-muted-foreground">
                  Enter the codes sent to <strong>{mobile}</strong> and <strong>{email}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <Label>Mobile OTP</Label>
                <div className="flex justify-center">
                  <InputOTP maxLength={4} value={mobileOtp} onChange={setMobileOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email OTP</Label>
                <div className="flex justify-center">
                  <InputOTP maxLength={4} value={emailOtp} onChange={setEmailOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button className="w-full" onClick={handleVerifyOtp} disabled={verifying}>
                {verifying ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Verifying…</> : "Verify OTP"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Didn't receive the code?{" "}
                <button className="text-primary underline" onClick={() => toast({ title: "OTP Resent", description: "New codes sent (mock)." })}>
                  Resend OTP
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ─── Staff Code Screen ───
  if (step === "code") {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Staff Code Generated" />
        <div className="px-4 py-5 max-w-md mx-auto">
          <Card>
            <CardContent className="p-6 space-y-6 text-center">
              <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto" />
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-foreground">Staff Code Generated Successfully</h2>
                <p className="text-sm text-muted-foreground">
                  Share this code with <strong>{fullName}</strong> to link their Staff App.
                </p>
              </div>

              <div className="bg-muted rounded-lg py-5 px-4">
                <p className="text-3xl font-mono font-bold tracking-widest text-foreground">{staffCode}</p>
              </div>

              <Button variant="outline" className="gap-2" onClick={handleCopyCode}>
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy Code"}
              </Button>

              <div className="text-xs text-muted-foreground space-y-1 pt-2">
                <p>This code is valid for <strong>24 hours</strong>.</p>
                <p>The staff member should enter this code in their Staff App and press <strong>Link</strong>.</p>
              </div>

              <Button className="w-full" onClick={() => navigate("/staff-management")}>
                Back to My Staffs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ─── Form Screen ───
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="New Staff Appointment" />
      <div className="px-4 py-5 max-w-2xl mx-auto">
        <Button variant="ghost" size="sm" className="mb-4 gap-1.5" onClick={() => navigate("/staff-management")}>
          <ArrowLeft className="h-4 w-4" />
          Back to My Staffs
        </Button>

        <Card>
          <CardContent className="p-5 space-y-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mandatory</p>

            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
              <Input id="fullName" placeholder="Enter full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mobile">Mobile Number <span className="text-destructive">*</span></Label>
              <Input id="mobile" type="tel" inputMode="numeric" placeholder="10-digit mobile number" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email ID <span className="text-destructive">*</span></Label>
              <Input id="email" type="email" placeholder="staff@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label>Government ID <span className="text-destructive">*</span></Label>
              <Select value={govIdType} onValueChange={setGovIdType}>
                <SelectTrigger><SelectValue placeholder="Select ID type" /></SelectTrigger>
                <SelectContent>
                  {govIdOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="flex gap-2 pt-1">
                <input ref={govIdInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, setGovIdFile, setGovIdPreview)} />
                <input ref={govIdCameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFileSelect(e, setGovIdFile, setGovIdPreview)} />
                <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => govIdInputRef.current?.click()}>
                  <Upload className="h-3.5 w-3.5" /> Upload
                </Button>
                <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => govIdCameraRef.current?.click()}>
                  <Camera className="h-3.5 w-3.5" /> Camera
                </Button>
              </div>
              {govIdPreview && <img src={govIdPreview} alt="ID preview" className="mt-2 h-24 rounded-md border border-border object-cover" />}
            </div>

            <div className="space-y-1.5">
              <Label>Staff Photo <span className="text-destructive">*</span></Label>
              <div className="flex gap-2">
                <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, setStaffPhoto, setStaffPhotoPreview)} />
                <input ref={photoCameraRef} type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => handleFileSelect(e, setStaffPhoto, setStaffPhotoPreview)} />
                <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => photoCameraRef.current?.click()}>
                  <Camera className="h-3.5 w-3.5" /> Take Photo
                </Button>
                <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => photoInputRef.current?.click()}>
                  <Upload className="h-3.5 w-3.5" /> Upload
                </Button>
              </div>
              {staffPhotoPreview && <img src={staffPhotoPreview} alt="Staff photo" className="mt-2 h-28 w-28 rounded-full border border-border object-cover" />}
            </div>

            <div className="border-t border-border pt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Optional</p>

              <div className="space-y-1.5 mb-5">
                <Label>Department / Role</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    {departmentOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
                {department === "Custom Role" && (
                  <Textarea placeholder="Describe the custom role…" value={customRole} onChange={(e) => setCustomRole(e.target.value)} className="mt-2" />
                )}
              </div>

              <div className="space-y-1.5 mb-5">
                <Label>Date of Appointment</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !appointmentDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(appointmentDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={appointmentDate} onSelect={(d) => d && setAppointmentDate(d)} initialFocus className={cn("p-3 pointer-events-auto")} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1.5 mb-5">
                <Label>Employment Type</Label>
                <Select value={employmentType} onValueChange={setEmploymentType}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {employmentOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Emergency Contact</Label>
                <Input placeholder="Contact name" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} />
                <Input type="tel" inputMode="numeric" placeholder="Contact phone number" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => navigate("/staff-management")}>Cancel</Button>
              <Button className="flex-1" onClick={handleConfirmAppointment}>Confirm Appointment</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
