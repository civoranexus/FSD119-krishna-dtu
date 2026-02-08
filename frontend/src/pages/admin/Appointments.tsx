import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Calendar, Eye } from "lucide-react";
import { api } from "@/lib/api";
import StatusBadge from "@/components/shared/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Appointment {
  _id: string;
  patientId?: { _id: string; name: string; email: string };
  doctorId?: { _id: string; name: string; email: string };
  appointment_date: string;
  appointment_time: string;
  reason: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  createdAt?: string;
}

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/appointments");
      const data = Array.isArray(response) ? response : response?.data || [];
      setAppointments(data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = 
      apt.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctorId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout role="admin">
      <div className="page-header">
        <h1 className="page-title">All Appointments</h1>
        <p className="page-description">
          View and manage all appointments across the platform
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient, doctor, or reason..."
            className="pl-10 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] h-11">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="healthcare-card text-center">
          <p className="text-2xl font-bold text-foreground">{appointments.length}</p>
          <p className="text-sm text-muted-foreground">Total</p>
        </div>
        <div className="healthcare-card text-center">
          <p className="text-2xl font-bold text-primary">{appointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length}</p>
          <p className="text-sm text-muted-foreground">Upcoming</p>
        </div>
        <div className="healthcare-card text-center">
          <p className="text-2xl font-bold text-success">{appointments.filter(a => a.status === 'completed').length}</p>
          <p className="text-sm text-muted-foreground">Completed</p>
        </div>
        <div className="healthcare-card text-center">
          <p className="text-2xl font-bold text-destructive">{appointments.filter(a => a.status === 'cancelled').length}</p>
          <p className="text-sm text-muted-foreground">Cancelled</p>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No appointments found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>
                    <p className="font-medium text-foreground">
                      {appointment.patientId?.name || "Unknown Patient"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.patientId?.email || "No email"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-foreground">
                      {appointment.doctorId?.name || "Unknown Doctor"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-foreground">{formatDate(appointment.appointment_date)}</p>
                    <p className="text-sm text-muted-foreground">{appointment.appointment_time}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-muted-foreground truncate max-w-[200px]">{appointment.reason}</p>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={appointment.status === 'scheduled' ? 'pending' : appointment.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination Info */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAppointments.length} of {appointments.length} appointments
        </p>
      </div>

      {/* Appointment Detail Dialog */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              Complete information about this appointment
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Patient</p>
                  <p className="font-medium">{selectedAppointment.patientId?.name || "Unknown"}</p>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.patientId?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Doctor</p>
                  <p className="font-medium">{selectedAppointment.doctorId?.name || "Unknown"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(selectedAppointment.appointment_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{selectedAppointment.appointment_time}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reason</p>
                <p className="font-medium">{selectedAppointment.reason}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <StatusBadge status={selectedAppointment.status === 'scheduled' ? 'pending' : selectedAppointment.status} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{formatDate(selectedAppointment.createdAt)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminAppointments;
