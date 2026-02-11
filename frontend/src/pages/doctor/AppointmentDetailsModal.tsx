import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDaySlot } from "@/lib/helpers";

interface AppointmentDetailsProps {
  appointment: {
    _id: string;
    patientName?: string;
    reason: string;
    day: string;
    slotIndex: number;
    status: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AppointmentDetailsModal({ appointment, open, onOpenChange }: AppointmentDetailsProps) {
  if (!appointment) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogDescription>
            Detailed information about this appointment.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Patient:</span> {appointment.patientName || 'Patient'}
          </div>
          <div>
            <span className="font-semibold">Reason:</span> {appointment.reason}
          </div>
          <div>
            <span className="font-semibold">Date & Time:</span> {formatDaySlot(appointment.day, appointment.slotIndex)}
          </div>
          <div>
            <span className="font-semibold">Status:</span> {appointment.status}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
