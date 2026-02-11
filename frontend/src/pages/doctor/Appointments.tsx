import { useState, useEffect } from "react";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/shared/StatusBadge";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api, { ApiResponse } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  APPOINTMENT_STATUS,
  LOADING_MESSAGES,
  EMPTY_MESSAGES,
} from "@/lib/constants";
import {
  formatDate,
  formatTime,
  formatDateTime,
  parseErrorMessage,
  formatDaySlot,
} from "@/lib/helpers";

interface Appointment {
  _id: string;
  patientId: string;
  patientName?: string;
  reason: string;
  day: string;
  slotIndex: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.get<ApiResponse<Appointment[]>>('/appointments/doctor');
      const data = response.appointments || response.data || [];
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = parseErrorMessage(error);
      setError(message);
      toast({
        variant: "destructive",
        title: "Error loading appointments",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = 
      apt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <DashboardLayout role="doctor">
        <LoadingState message={LOADING_MESSAGES.APPOINTMENTS} />
      </DashboardLayout>
    );
  }

  if (error && appointments.length === 0) {
    return (
      <DashboardLayout role="doctor">
        <ErrorState message={error} onRetry={fetchAppointments} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="doctor">
      <div className="page-header">
        <h1 className="page-title">Appointments</h1>
        <p className="page-description">
          View and manage your patient appointments
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            className="pl-10 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px] h-11">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value={APPOINTMENT_STATUS.SCHEDULED}>Scheduled</SelectItem>
            <SelectItem value={APPOINTMENT_STATUS.CONFIRMED}>Confirmed</SelectItem>
            <SelectItem value={APPOINTMENT_STATUS.COMPLETED}>Completed</SelectItem>
            <SelectItem value={APPOINTMENT_STATUS.CANCELLED}>Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table - Desktop */}
      <div className="hidden md:block table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Reason for Visit</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState
                    icon={Calendar}
                    title={EMPTY_MESSAGES.NO_APPOINTMENTS}
                    description="No patient appointments scheduled yet."
                  />
                </TableCell>
              </TableRow>
            ) : (
              filteredAppointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>
                    <p className="font-medium text-foreground">
                      {appointment.patientName || 'Patient'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-foreground max-w-xs truncate">
                      {appointment.reason}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">
                        {formatDaySlot(appointment.day, appointment.slotIndex)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge 
                      status={appointment.status === 'scheduled' ? 'pending' : appointment.status} 
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setDetailsOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredAppointments.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title={EMPTY_MESSAGES.NO_APPOINTMENTS}
            description="No patient appointments scheduled yet."
          />
        ) : (
          filteredAppointments.map((appointment) => (
            <div key={appointment._id} className="healthcare-card p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-foreground">
                    {appointment.patientName || 'Patient'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDaySlot(appointment.day, appointment.slotIndex)}
                  </p>
                </div>
                <StatusBadge 
                  status={appointment.status === 'scheduled' ? 'pending' : appointment.status} 
                />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {appointment.reason}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setSelectedAppointment(appointment);
                  setDetailsOpen(true);
                }}
              >
                View Details
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open);
          if (!open) setSelectedAppointment(null);
        }}
      />
    </DashboardLayout>
  );
};

export default DoctorAppointments;
