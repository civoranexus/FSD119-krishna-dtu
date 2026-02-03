import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Users, Calendar, UserCheck, Activity, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";

interface Activity {
  id: string | number;
  type: string;
  message: string;
  time: string;
}

interface Stats {
  totalUsers: number;
  activeDoctors: number;
  appointmentsToday: number;
  completedToday: number;
}

const AdminDashboard = () => {
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeDoctors: 0,
    appointmentsToday: 0,
    completedToday: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch users for stats
        const usersResponse = await api.get("/users");
        const users = Array.isArray(usersResponse) ? usersResponse : usersResponse?.data || [];
        
        // Fetch appointments
        const appointmentsResponse = await api.get("/appointments");
        const appointments = Array.isArray(appointmentsResponse) ? appointmentsResponse : appointmentsResponse?.data || [];
        
        // Calculate stats
        const doctors = users.filter((u: { role: string }) => u.role === "doctor");
        const today = new Date().toDateString();
        const todayAppointments = appointments.filter((a: { date: string }) => 
          new Date(a.date).toDateString() === today
        );
        const completedToday = todayAppointments.filter((a: { status: string }) => 
          a.status === "completed"
        );

        setStats({
          totalUsers: users.length,
          activeDoctors: doctors.length,
          appointmentsToday: todayAppointments.length,
          completedToday: completedToday.length,
        });

        // Create recent activity from latest data
        const activities: Activity[] = [];
        
        // Add recent user registrations
        const recentUsers = users.slice(-3).reverse();
        recentUsers.forEach((user: { _id: string; name: string; role: string; createdAt: string }, index: number) => {
          activities.push({
            id: `user-${user._id || index}`,
            type: user.role === "doctor" ? "user_registered" : "user_registered",
            message: `New ${user.role} registered: ${user.name}`,
            time: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently",
          });
        });

        // Add recent appointments
        const recentAppointments = appointments.slice(-3).reverse();
        recentAppointments.forEach((apt: { _id: string; status: string; doctorId?: { name: string }; createdAt: string }, index: number) => {
          activities.push({
            id: `apt-${apt._id || index}`,
            type: apt.status === "cancelled" ? "appointment_cancelled" : "appointment_booked",
            message: apt.status === "cancelled" 
              ? "Appointment cancelled" 
              : `Appointment booked${apt.doctorId?.name ? ` with ${apt.doctorId.name}` : ""}`,
            time: apt.createdAt ? new Date(apt.createdAt).toLocaleDateString() : "Recently",
          });
        });

        setRecentActivity(activities.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-description">
          System overview and platform management
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={<Users className="h-5 w-5" />}
          description="Registered users"
        />
        <StatCard
          title="Active Doctors"
          value={stats.activeDoctors.toString()}
          icon={<UserCheck className="h-5 w-5" />}
          description="Available for appointments"
        />
        <StatCard
          title="Appointments Today"
          value={stats.appointmentsToday.toString()}
          icon={<Calendar className="h-5 w-5" />}
          description={`${stats.completedToday} completed`}
        />
        <StatCard
          title="Platform Status"
          value="Online"
          icon={<Activity className="h-5 w-5" />}
          description="All systems operational"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 healthcare-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title mb-0">Recent Activity</h2>
            <Button variant="ghost" size="sm">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === "user_registered" ? "bg-success" :
                      activity.type === "appointment_booked" ? "bg-primary" :
                      activity.type === "appointment_cancelled" ? "bg-warning" :
                      "bg-muted-foreground"
                    }`} />
                    <p className="text-foreground">{activity.message}</p>
                  </div>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Status */}
        <div className="healthcare-card">
          <h2 className="section-title">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">API Status</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Operational</span>
                <div className="w-2 h-2 rounded-full bg-success" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Database</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Connected</span>
                <div className="w-2 h-2 rounded-full bg-success" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Authentication</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Active</span>
                <div className="w-2 h-2 rounded-full bg-success" />
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-border">
            <Button variant="outline" className="w-full">
              View Full Report
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button variant="outline" className="h-auto py-4" asChild>
          <Link to="/admin/users" className="flex flex-col items-center gap-2">
            <Users className="h-5 w-5" />
            <span>Manage Users</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4">
          <div className="flex flex-col items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>View Appointments</span>
          </div>
        </Button>
        <Button variant="outline" className="h-auto py-4">
          <div className="flex flex-col items-center gap-2">
            <Activity className="h-5 w-5" />
            <span>System Logs</span>
          </div>
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
