import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save, Plus, Trash2, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  TIME_SLOTS,
  TOAST_MESSAGES,
  LOADING_MESSAGES,
} from "@/lib/constants";
import { parseErrorMessage } from "@/lib/helpers";

interface TimeSlot {
  start: string;
  end: string;
}

interface WeekDay {
  day: string;
  enabled: boolean;
  slots: TimeSlot[];
}

const defaultWeekDays: WeekDay[] = [
  { day: "Monday", enabled: false, slots: [] },
  { day: "Tuesday", enabled: false, slots: [] },
  { day: "Wednesday", enabled: false, slots: [] },
  { day: "Thursday", enabled: false, slots: [] },
  { day: "Friday", enabled: false, slots: [] },
  { day: "Saturday", enabled: false, slots: [] },
  { day: "Sunday", enabled: false, slots: [] },
];

const DoctorAvailability = () => {
  const [weekDays, setWeekDays] = useState<WeekDay[]>(defaultWeekDays);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.get("/availability/me");
      const data = Array.isArray(response) ? response[0] : response?.data || response;
      
      if (data?.weeklySchedule) {
        const updatedDays = defaultWeekDays.map(defaultDay => {
          const fetchedDay = data.weeklySchedule.find(
            (d: WeekDay) => d.day === defaultDay.day
          );
          return fetchedDay || defaultDay;
        });
        setWeekDays(updatedDays);
      }
    } catch (error) {
      const message = parseErrorMessage(error);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDay = (dayName: string) => {
    setWeekDays(prev => prev.map(day => 
      day.day === dayName ? { ...day, enabled: !day.enabled } : day
    ));
  };

  const addSlot = (dayName: string) => {
    setWeekDays(prev => prev.map(day => 
      day.day === dayName 
        ? { ...day, slots: [...day.slots, { start: "09:00", end: "17:00" }] }
        : day
    ));
  };

  const removeSlot = (dayName: string, slotIndex: number) => {
    setWeekDays(prev => prev.map(day => 
      day.day === dayName 
        ? { ...day, slots: day.slots.filter((_, i) => i !== slotIndex) }
        : day
    ));
  };

  const updateSlot = (dayName: string, slotIndex: number, field: 'start' | 'end', value: string) => {
    setWeekDays(prev => prev.map(day => 
      day.day === dayName 
        ? {
            ...day,
            slots: day.slots.map((slot, i) => 
              i === slotIndex ? { ...slot, [field]: value } : slot
            )
          }
        : day
    ));
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${dayName}-${slotIndex}`];
      return newErrors;
    });
  };

  const validateSlots = (): boolean => {
    const errors: Record<string, string> = {};
    
    weekDays.forEach(day => {
      if (day.enabled) {
        if (day.slots.length === 0) {
          errors[day.day] = "Add at least one time slot for enabled days";
        }
        
        day.slots.forEach((slot, index) => {
          if (slot.start >= slot.end) {
            errors[`${day.day}-${index}`] = "Start time must be before end time";
          }
        });
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateSlots()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors before saving.",
      });
      return;
    }

    try {
      setIsSaving(true);
      await api.put("/availability/doctor", {
        weeklySchedule: weekDays,
      });
      
      toast({
        title: "Success",
        description: TOAST_MESSAGES.AVAILABILITY_SAVED,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: parseErrorMessage(error),
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout role="doctor">
        <LoadingState message={LOADING_MESSAGES.AVAILABILITY} />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="doctor">
        <ErrorState message={error} onRetry={fetchAvailability} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="doctor">
      <div className="page-header flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="page-title">Availability</h1>
          <p className="page-description">
            Configure your weekly schedule
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="healthcare-card">
        <h2 className="section-title">Weekly Schedule</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Set your regular working hours for each day of the week
        </p>

        <div className="space-y-6">
          {weekDays.map((day) => (
            <div
              key={day.day}
              className={`p-4 rounded-lg border ${
                day.enabled ? "bg-background border-border" : "bg-muted/30 border-muted"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Switch 
                    id={day.day} 
                    checked={day.enabled} 
                    onCheckedChange={() => toggleDay(day.day)}
                  />
                  <Label
                    htmlFor={day.day}
                    className={`font-medium ${day.enabled ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {day.day}
                  </Label>
                </div>
                {day.enabled && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => addSlot(day.day)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Slot
                  </Button>
                )}
              </div>

              {validationErrors[day.day] && (
                <div className="flex items-center gap-2 text-sm text-destructive mb-3 pl-10">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors[day.day]}
                </div>
              )}

              {day.enabled && day.slots.length > 0 && (
                <div className="space-y-3 pl-10">
                  {day.slots.map((slot, index) => (
                    <div key={index}>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 flex-1">
                          <Select
                            value={slot.start}
                            onValueChange={(value) => updateSlot(day.day, index, 'start', value)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_SLOTS.map((timeSlot) => (
                                <SelectItem key={timeSlot.value} value={timeSlot.value}>
                                  {timeSlot.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="text-muted-foreground">to</span>
                          <Select
                            value={slot.end}
                            onValueChange={(value) => updateSlot(day.day, index, 'end', value)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_SLOTS.map((timeSlot) => (
                                <SelectItem key={timeSlot.value} value={timeSlot.value}>
                                  {timeSlot.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => removeSlot(day.day, index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {validationErrors[`${day.day}-${index}`] && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {validationErrors[`${day.day}-${index}`]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {day.enabled && day.slots.length === 0 && (
                <p className="text-sm text-muted-foreground pl-10">
                  No time slots configured. Add a slot to accept appointments.
                </p>
              )}

              {!day.enabled && (
                <p className="text-sm text-muted-foreground pl-10">
                  Not available on this day
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorAvailability;
