export interface StaffMember {
  id: string;
  name: string;
  department: string;
  appointmentDate: string;
  linkStatus: "linked" | "not_linked";
  staffCode?: string;
  codeGeneratedAt?: string;
  mobile?: string;
  email?: string;
  govIdType?: string;
  employmentType?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  customRole?: string;
  removed?: boolean;
  removedAt?: string;
  removeReason?: string;
}

export const mockStaff: StaffMember[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    department: "Kitchen",
    appointmentDate: "2024-06-15",
    linkStatus: "linked",
    staffCode: "STF-RK8H4M",
    codeGeneratedAt: "2024-06-15T10:00:00Z",
    mobile: "9876543210",
    email: "rajesh.kumar@email.com",
    govIdType: "Aadhaar",
    employmentType: "Full Time",
    emergencyName: "Sita Kumar",
    emergencyPhone: "9876543211",
  },
  {
    id: "2",
    name: "Priya Sharma",
    department: "Main Counter",
    appointmentDate: "2024-09-01",
    linkStatus: "not_linked",
    staffCode: "STF-PS3J7N",
    codeGeneratedAt: "2024-09-01T09:30:00Z",
    mobile: "8765432109",
    email: "priya.sharma@email.com",
    govIdType: "Voter ID",
    employmentType: "Full Time",
    emergencyName: "Vikram Sharma",
    emergencyPhone: "8765432110",
  },
  {
    id: "3",
    name: "Arun Patel",
    department: "Tea/Coffee Counter",
    appointmentDate: "2025-01-10",
    linkStatus: "linked",
    staffCode: "STF-AP9K2L",
    codeGeneratedAt: "2025-01-10T11:00:00Z",
    mobile: "7654321098",
    email: "arun.patel@email.com",
    govIdType: "Driving License",
    employmentType: "Part Time",
    emergencyName: "Geeta Patel",
    emergencyPhone: "7654321099",
  },
  {
    id: "4",
    name: "Meena Devi",
    department: "Kitchen",
    appointmentDate: "2025-02-20",
    linkStatus: "not_linked",
    staffCode: "STF-MD5F8Q",
    codeGeneratedAt: "2025-02-20T14:00:00Z",
    mobile: "6543210987",
    email: "meena.devi@email.com",
    govIdType: "Aadhaar",
    employmentType: "Temporary",
    emergencyName: "Ram Devi",
    emergencyPhone: "6543210988",
  },
  {
    id: "5",
    name: "Suresh Babu",
    department: "Manager",
    appointmentDate: "2024-03-05",
    linkStatus: "linked",
    staffCode: "STF-SB1W6T",
    codeGeneratedAt: "2024-03-05T08:00:00Z",
    mobile: "5432109876",
    email: "suresh.babu@email.com",
    govIdType: "Passport",
    employmentType: "Full Time",
    emergencyName: "Lakshmi Babu",
    emergencyPhone: "5432109877",
  },
];
