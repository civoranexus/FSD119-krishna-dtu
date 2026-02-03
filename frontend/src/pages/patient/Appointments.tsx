import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  _id: string;
  doctorId: string;
  doctorName?: string;
  specialty?: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  location?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/appointments/patient');
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

  const filteredAppointments = appointments.filter(apt =>
    apt.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.reason?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <DashboardLayout role="patient">
      <div className="page-header flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="page-description">
            Manage your upcoming and past appointments
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Book Appointment
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments..."
            className="pl-10 h-11"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Table */}
      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Healthcare Provider</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead className="hidden md:table-cell">Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Loading appointments...
                </TableCell>
              </TableRow>
            ) : filteredAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No appointments found
                </TableCell>
              </TableRow>
            ) : (
              filteredAppointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{appointment.doctorName || 'Doctor'}</p>
                      <p className="text-sm text-muted-foreground">{appointment.specialty || 'Specialist'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{appointment.appointment_date}</p>
                      <p className="text-sm text-muted-foreground">{appointment.appointment_time}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p className="text-muted-foreground">{appointment.reason}</p>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={appointment.status === 'scheduled' ? 'pending' : appointment.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {(appointment.status === "scheduled" || appointment.status === "confirmed") && (
                        <>
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            Cancel
                          </Button>
                        </>
                      )}
                      {appointment.status === "completed" && (
                        <Button variant="outline" size="sm">
                          View Summary
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAppointments.length} appointments
        </p>
      </div>
    </DashboardLayout>
  );
};

export default PatientAppointments;
