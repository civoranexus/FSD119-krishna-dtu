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
import { formatDaySlot, formatDayName } from "@/lib/helpers";

interface Appointment {
  _id: string;
  doctorId: string;
  doctorName?: string;
  day: string;
  slotIndex: number;
  reason: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  
  // Legacy fields (may exist in old records)
  appointment_date?: string;
  appointment_time?: string;
}

interface MedicalRecord {
  _id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  doctorName?: string;
  provider?: string;
}

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const user = getUser();
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
    fetchMedicalRecords();
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      // Backend endpoint: GET /api/appointments/patient
      const response = await api.get('/appointments/patient');
      // Handle multiple response formats: { appointments: [] }, { data: [] }, or direct array
      const data = response?.appointments || response?.data || (Array.isArray(response) ? response : []);
      
      // STRICT VALIDATION: Filter out appointments without day/slotIndex
      const validAppointments = data.filter((apt: any) => {
        const isValid = apt.day && typeof apt.slotIndex === 'number';
        if (!isValid && apt._id) {
          console.warn('⚠️ Dashboard: Skipping appointment with legacy schema:', apt._id);
        }
        return isValid;
      });
      
      setAppointments(validAppointments);
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

  const fetchMedicalRecords = async () => {
    try {
      setRecordsLoading(true);
      const response = await api.get('/ehr/patient');
      const data = response?.data || response || [];
      setMedicalRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading medical records:', error);
      setMedicalRecords([]);
    } finally {
      setRecordsLoading(false);
    }
  };

  // Filter upcoming appointments (not completed or cancelled)
  const upcomingAppointments = appointments
    .filter((apt) => apt.status === 'scheduled' || apt.status === 'confirmed')
    .slice(0, 3);

  // Get recent medical records
  const recentRecords = medicalRecords.slice(0, 3);

  return (
    <DashboardLayout role="patient">
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.name || 'Patient'}</h1>
        <p className="page-description">
          Here's an overview of your health management
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Upcoming Appointments"
          value={upcomingAppointments.length.toString()}
          icon={<Calendar className="h-5 w-5" />}
          description={upcomingAppointments[0] ? `Next: ${formatDaySlot(upcomingAppointments[0].day, upcomingAppointments[0].slotIndex)}` : "No upcoming appointments"}
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
              {upcomingAppointments.map((appointment) => {
                // DEFENSIVE: Skip if missing critical fields
                if (!appointment.day || typeof appointment.slotIndex !== 'number') {
                  return null;
                }
                
                return (
                  <div
                    key={appointment._id}
                    className="flex items-start justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{appointment.doctorName || `Doctor ID: ${appointment.doctorId}`}</p>
                      <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDaySlot(appointment.day, appointment.slotIndex)}
                      </p>
                    </div>
                    <StatusBadge status={appointment.status} />
                  </div>
                );
              })}
            </div>
          )}
          <Button variant="ghost" className="w-full mt-4" asChild>
            <Link to="/patient/appointments">View All Appointments</Link>
          </Button>
        </div>

        {/* Medical Records */}
        <div className="healthcare-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title mb-0">Recent Medical Records</h2>
          </div>
          {recordsLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading records...
            </div>
          ) : recentRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No medical records yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentRecords.map((record) => (
                <div
                  key={record._id}
                  className="flex items-start justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary">
                        {record.type}
                      </span>
                    </div>
                    <p className="font-medium text-foreground">{record.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{record.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(record.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
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
