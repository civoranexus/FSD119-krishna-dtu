import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, CheckCircle, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/lib/api";
import { getUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  _id: string;
  patientId: string;
  patientName?: string;
  patientAge?: number;
  reason: string;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const user = getUser();
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
    // Poll every 15 seconds for real-time updates
    const interval = setInterval(fetchAppointments, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/appointments/doctor');
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

  // Get today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => 
    apt.appointment_date === today || apt.appointment_date?.includes(today)
  );
  
  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'scheduled' || apt.status === 'confirmed'
  );
  
  const completedToday = todayAppointments.filter(apt => apt.status === 'completed').length;
  return (
    <DashboardLayout role="doctor">
      <div className="page-header">
        <h1 className="page-title">Welcome, {user?.name || 'Doctor'}</h1>
        <p className="page-description">
          You have {todayAppointments.length} appointments scheduled for today
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Today's Appointments"
          value={todayAppointments.length.toString()}
          icon={<Calendar className="h-5 w-5" />}
          description={`${upcomingAppointments.length} upcoming`}
        />
        <StatCard
          title="Total Appointments"
          value={appointments.length.toString()}
          icon={<Users className="h-5 w-5" />}
          description="All appointments"
        />
        <StatCard
          title="Completed Today"
          value={completedToday.toString()}
          icon={<CheckCircle className="h-5 w-5" />}
          description={`${todayAppointments.length - completedToday} remaining`}
        />
        <StatCard
          title="Status"
          value="Active"
          icon={<Clock className="h-5 w-5" />}
          description="Account is active"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 healthcare-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title mb-0">Today's Schedule</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/doctor/appointments">View All</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading appointments...
              </div>
            ) : todayAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No appointments scheduled for today
              </div>
            ) : (
              todayAppointments.slice(0, 5).map((appointment, index) => (
                <div
                  key={appointment._id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                    index < 2 ? "bg-muted/30" : "bg-muted/50 hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <p className="font-semibold text-foreground">{appointment.appointment_time}</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {appointment.patientName || 'Patient'}
                        {appointment.patientAge && (
                          <span className="text-muted-foreground font-normal ml-2">
                            {appointment.patientAge} yrs
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={appointment.status === 'scheduled' ? 'pending' : appointment.status} />
                    <Button size="sm" variant="outline" onClick={() => setSelectedAppointment(appointment)}>View</Button>
                    {/* Status change actions for doctor */}
                    {appointment.status === 'scheduled' && (
                      <Button size="sm" variant="secondary" onClick={async () => {
                        try {
                          await api.patch(`/appointments/${appointment._id}/confirm`);
                          toast({ title: 'Appointment confirmed' });
                          fetchAppointments();
                        } catch (err) {
                          toast({ variant: 'destructive', title: 'Error', description: err instanceof Error ? err.message : 'Failed to confirm' });
                        }
                      }}>Confirm</Button>
                    )}
                    {appointment.status === 'confirmed' && (
                      <Button size="sm" variant="secondary" onClick={async () => {
                        try {
                          await api.patch(`/appointments/${appointment._id}/complete`);
                          toast({ title: 'Appointment marked as completed' });
                          fetchAppointments();
                        } catch (err) {
                          toast({ variant: 'destructive', title: 'Error', description: err instanceof Error ? err.message : 'Failed to complete' });
                        }
                      }}>Complete</Button>
                    )}
                    {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                      <Button size="sm" variant="destructive" onClick={async () => {
                        try {
                          await api.patch(`/appointments/${appointment._id}/cancel`);
                          toast({ title: 'Appointment cancelled' });
                          fetchAppointments();
                        } catch (err) {
                          toast({ variant: 'destructive', title: 'Error', description: err instanceof Error ? err.message : 'Failed to cancel' });
                        }
                      }}>Cancel</Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="healthcare-card">
          <h2 className="section-title">Quick Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Scheduled</span>
              <span className="font-medium">{appointments.filter(a => a.status === 'scheduled').length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Confirmed</span>
              <span className="font-medium">{appointments.filter(a => a.status === 'confirmed').length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Completed</span>
              <span className="font-medium">{appointments.filter(a => a.status === 'completed').length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Cancelled</span>
              <span className="font-medium">{appointments.filter(a => a.status === 'cancelled').length}</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-border">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/doctor/availability">Manage Availability</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button variant="outline" className="h-auto py-4" asChild>
          <Link to="/doctor/appointments" className="flex flex-col items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>View All Appointments</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4" asChild>
          <Link to="/doctor/availability" className="flex flex-col items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>Update Availability</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4" asChild>
          <Link to="/contact" className="flex flex-col items-center gap-2">
            <Users className="h-5 w-5" />
            <span>Contact Support</span>
          </Link>
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
