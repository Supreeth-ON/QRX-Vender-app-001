import { LayoutDashboard, Menu as MenuIcon, Pause, BarChart3, Settings, User, HelpCircle, LogOut, Menu, ChefHat, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import qrxLogo from "@/assets/qrx-logo.png";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Dashboard Overview", url: "/", icon: LayoutDashboard },
  { title: "Menu Management", url: "/menu", icon: MenuIcon },
  { title: "Kitchen Management", url: "/kitchen-management", icon: ChefHat },
  { title: "Staff Management", url: "/staff-management", icon: Users },
  { title: "Master Pause", url: "/master-pause", icon: Pause },
  { title: "Orders & Analytics", url: "/orders-analytics", icon: BarChart3 },
  { title: "Hotel Settings", url: "/hotel-settings", icon: Settings },
  { title: "Account & Profile", url: "/account-profile", icon: User },
  { title: "Help & Support", url: "/help-support", icon: HelpCircle },
  { title: "Log out", url: "/logout", icon: LogOut },
];

export function VendorSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative w-full border-b bg-background">
      <div className="flex h-14 items-center px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <SheetHeader className="border-b border-border p-6">
              <SheetTitle className="flex items-center gap-3">
                <div className="h-8 w-8 bg-gradient-to-r from-primary to-accent rounded" style={{ maskImage: `url(${qrxLogo})`, maskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskImage: `url(${qrxLogo})`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat' }} />
                <span className="text-[1.701rem] font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-wide">
                  QRX - Vendor
                </span>
              </SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <div className="px-3 py-2">
                <div className="space-y-1">
                  {menuItems.map((item) => (
                    <NavLink
                      key={item.title}
                      to={item.url}
                      end
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground font-medium shadow-md"
                            : "text-foreground hover:bg-secondary"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-gradient-to-r from-primary to-accent rounded" style={{ maskImage: `url(${qrxLogo})`, maskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskImage: `url(${qrxLogo})`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat' }} />
          <h1 className="text-[1.134rem] font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-wide">
            QRX - Vendor
          </h1>
        </div>
      </div>
    </header>
  );
}
