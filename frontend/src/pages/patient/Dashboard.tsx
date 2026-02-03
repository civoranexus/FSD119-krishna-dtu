import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Clock, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { getUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  _id: string;
  doctorId: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = getUser();
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      // Backend endpoint: GET /api/appointments/patient
      const response = await api.get('/appointments/patient');
      // Handle both direct array and wrapped response
      const data = Array.isArray(response) ? response : response?.data || [];
      setAppointments(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading appointments",
        description: error instanceof Error ? error.message : "Failed to fetch appointments",
      });
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter upcoming appointments (not completed or cancelled)
  const upcomingAppointments = appointments
    .filter((apt) => apt.status === 'scheduled' || apt.status === 'confirmed')
    .slice(0, 3);

  return (
    <DashboardLayout role="patient">
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.name || 'Patient'}</h1>
        <p className="page-description">
          Here's an overview of your health management dashboard
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Upcoming Appointments"
          value={upcomingAppointments.length.toString()}
          icon={<Calendar className="h-5 w-5" />}
          description={upcomingAppointments[0] ? `Next: ${upcomingAppointments[0].appointment_date}` : "No upcoming appointments"}
        />
        <StatCard
          title="Total Appointments"
          value={appointments.length.toString()}
          icon={<FileText className="h-5 w-5" />}
          description="All appointments"
        />
        <StatCard
          title="Status"
          value="Active"
          icon={<Clock className="h-5 w-5" />}
          description="Account is active"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <div className="healthcare-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title mb-0">Upcoming Appointments</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/patient/appointments">
                <Plus className="h-4 w-4" />
                Book New
              </Link>
            </Button>
          </div>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading appointments...
            </div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No upcoming appointments</p>
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link to="/patient/appointments">Book your first appointment</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex items-start justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground">Doctor ID: {appointment.doctorId}</p>
                    <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {appointment.appointment_date} at {appointment.appointment_time}
                    </p>
                  </div>
                  <StatusBadge status={appointment.status} />
                </div>
              ))}
            </div>
          )}
          <Button variant="ghost" className="w-full mt-4" asChild>
            <Link to="/patient/appointments">View All Appointments</Link>
          </Button>
        </div>

        {/* Medical Records Placeholder */}
        <div className="healthcare-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title mb-0">Medical Records</h2>
          </div>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Medical records feature coming soon</p>
          </div>
          <Button variant="ghost" className="w-full mt-4" asChild>
            <Link to="/patient/records">View All Records</Link>
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 healthcare-card bg-accent/30">
        <h2 className="section-title">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
            <Link to="/patient/appointments">
              <Calendar className="h-5 w-5" />
              <span>Book Appointment</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
            <Link to="/patient/records">
              <FileText className="h-5 w-5" />
              <span>View Records</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
            <Link to="/contact">
              <Clock className="h-5 w-5" />
              <span>Contact Support</span>
            </Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
