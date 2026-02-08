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
import { Plus, Search, Filter, X, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [showBookDialog, setShowBookDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [bookingData, setBookingData] = useState({
    doctorId: "",
    date: "",
    time: "",
    reason: "",
  });
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

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleBookAppointment = async () => {
    try {
      await api.post('/appointments', {
        ...bookingData,
        appointment_date: bookingData.date,
        appointment_time: bookingData.time,
      });
      toast({
        title: "Appointment booked",
        description: "Your appointment has been scheduled successfully.",
      });
      setShowBookDialog(false);
      setBookingData({ doctorId: "", date: "", time: "", reason: "" });
      fetchAppointments();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Booking failed",
        description: error instanceof Error ? error.message : "Failed to book appointment",
      });
    }
  };

  const handleReschedule = async () => {
    if (!selectedAppointment) return;
    try {
      await api.put(`/appointments/${selectedAppointment._id}`, {
        appointment_date: bookingData.date,
        appointment_time: bookingData.time,
      });
      toast({
        title: "Appointment rescheduled",
        description: "Your appointment has been rescheduled successfully.",
      });
      setShowRescheduleDialog(false);
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Reschedule failed",
        description: error instanceof Error ? error.message : "Failed to reschedule",
      });
    }
  };

  const handleCancel = async () => {
    if (!selectedAppointment) return;
    try {
      await api.put(`/appointments/${selectedAppointment._id}`, {
        status: "cancelled",
      });
      toast({
        title: "Appointment cancelled",
        description: "Your appointment has been cancelled.",
      });
      setShowCancelDialog(false);
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Cancellation failed",
        description: error instanceof Error ? error.message : "Failed to cancel",
      });
    }
  };

  return (
    <DashboardLayout role="patient">
      <div className="page-header flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="page-description">
            Manage your upcoming and past appointments
          </p>
        </div>
        <Button onClick={() => setShowBookDialog(true)}>
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] h-11">
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setBookingData({
                                ...bookingData,
                                date: appointment.appointment_date,
                                time: appointment.appointment_time,
                              });
                              setShowRescheduleDialog(true);
                            }}
                          >
                            Reschedule
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowCancelDialog(true);
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {appointment.status === "completed" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowSummaryDialog(true);
                          }}
                        >
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

      {/* Book Appointment Dialog */}
      <Dialog open={showBookDialog} onOpenChange={setShowBookDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book New Appointment</DialogTitle>
            <DialogDescription>
              Fill in the details to schedule a new appointment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="input-group">
              <Label>Preferred Date</Label>
              <Input
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="input-group">
              <Label>Preferred Time</Label>
              <Select
                value={bookingData.time}
                onValueChange={(value) => setBookingData({ ...bookingData, time: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="input-group">
              <Label>Reason for Visit</Label>
              <Textarea
                placeholder="Describe the reason for your appointment..."
                value={bookingData.reason}
                onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookAppointment}>
              Book Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Select a new date and time for your appointment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="input-group">
              <Label>New Date</Label>
              <Input
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="input-group">
              <Label>New Time</Label>
              <Select
                value={bookingData.time}
                onValueChange={(value) => setBookingData({ ...bookingData, time: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRescheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleReschedule}>
              Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
              {selectedAppointment && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedAppointment.doctorName || 'Doctor'}</p>
                  <p className="text-sm">{selectedAppointment.appointment_date} at {selectedAppointment.appointment_time}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Summary Dialog */}
      <Dialog open={showSummaryDialog} onOpenChange={setShowSummaryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Summary</DialogTitle>
            <DialogDescription>
              Details and notes from your completed appointment
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Provider</p>
                  <p className="font-medium">{selectedAppointment.doctorName || 'Doctor'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Specialty</p>
                  <p className="font-medium">{selectedAppointment.specialty || 'General'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedAppointment.appointment_date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{selectedAppointment.appointment_time}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reason for Visit</p>
                <p className="font-medium">{selectedAppointment.reason}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <StatusBadge status="completed" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowSummaryDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PatientAppointments;
