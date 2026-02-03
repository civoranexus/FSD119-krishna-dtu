import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";

interface TimeSlot {
  start: string;
  end: string;
}

interface WeekDay {
  day: string;
  enabled: boolean;
  slots: TimeSlot[];
}

interface BlockedDate {
  _id?: string;
  date: string;
  reason: string;
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
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/availability/doctor");
        const data = Array.isArray(response) ? response[0] : response?.data || response;
        
        if (data?.weeklySchedule) {
          // Merge fetched data with default days
          const updatedDays = defaultWeekDays.map(defaultDay => {
            const fetchedDay = data.weeklySchedule.find(
              (d: WeekDay) => d.day === defaultDay.day
            );
            return fetchedDay || defaultDay;
          });
          setWeekDays(updatedDays);
        }
        
        if (data?.blockedDates) {
          setBlockedDates(data.blockedDates);
        }
      } catch (error) {
        console.error("Failed to fetch availability:", error);
        // Keep defaults if API fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  const toggleDay = (dayName: string) => {
    setWeekDays(prev => prev.map(day => 
      day.day === dayName ? { ...day, enabled: !day.enabled } : day
    ));
  };

  const handleSave = async () => {
    try {
      await api.put("/availability/doctor", {
        weeklySchedule: weekDays,
        blockedDates,
      });
      alert("Availability saved successfully!");
    } catch (error) {
      console.error("Failed to save availability:", error);
      alert("Failed to save availability");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout role="doctor">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading availability...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="doctor">
      <div className="page-header flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="page-title">Availability</h1>
          <p className="page-description">
            Configure your weekly schedule and block specific dates
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Schedule */}
        <div className="lg:col-span-2 healthcare-card">
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
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4" />
                      Add Slot
                    </Button>
                  )}
                </div>

                {day.enabled && day.slots.length > 0 && (
                  <div className="space-y-3 pl-10">
                    {day.slots.map((slot, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="healthcare-card py-2 px-4 border-input">
                            <span className="text-sm font-medium">{slot.start}</span>
                          </div>
                          <span className="text-muted-foreground">to</span>
                          <div className="healthcare-card py-2 px-4 border-input">
                            <span className="text-sm font-medium">{slot.end}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

        {/* Blocked Dates */}
        <div className="space-y-6">
          <div className="healthcare-card">
            <h2 className="section-title">Blocked Dates</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Block specific dates when you're unavailable
            </p>

            <div className="space-y-3 mb-4">
              {blockedDates.map((blocked, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-foreground text-sm">{blocked.date}</p>
                    <p className="text-xs text-muted-foreground">{blocked.reason}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4" />
              Block Date
            </Button>
          </div>

          <div className="healthcare-card bg-accent/30">
            <h3 className="font-semibold text-foreground mb-2">Appointment Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="buffer" className="text-sm">Buffer between appointments</Label>
                <span className="text-sm font-medium text-foreground">15 min</span>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="duration" className="text-sm">Default appointment duration</Label>
                <span className="text-sm font-medium text-foreground">30 min</span>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="advance" className="text-sm">Advance booking limit</Label>
                <span className="text-sm font-medium text-foreground">30 days</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              Edit Settings
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorAvailability;
