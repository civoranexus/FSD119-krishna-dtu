import { ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "patient" | "doctor" | "admin";
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar role={role} />
      <main className={cn("min-h-screen transition-all duration-300 md:ml-16 lg:ml-64")}>
        <div className="container py-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
