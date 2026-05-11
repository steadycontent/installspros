import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, addDays, isWeekend, isBefore, startOfToday } from "date-fns";
import { Clock, CalendarDays, CheckCircle } from "lucide-react";

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

interface ScheduleCalendarProps {
  onSchedule?: (date: Date, time: string) => void;
}

const ScheduleCalendar = ({ onSchedule }: ScheduleCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const today = startOfToday();
  const minDate = addDays(today, 1); // At least 1 day in advance

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      setIsConfirmed(true);
      onSchedule?.(selectedDate, selectedTime);
    }
  };

  if (isConfirmed && selectedDate && selectedTime) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Call Scheduled!</h3>
        <p className="text-gray-600 mb-4">
          We'll call you on <span className="font-semibold">{format(selectedDate, "EEEE, MMMM d, yyyy")}</span> at <span className="font-semibold">{selectedTime}</span>
        </p>
        <p className="text-sm text-gray-500">
          You'll receive a confirmation email with calendar invite shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <CalendarDays className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold text-gray-900">Schedule a Call</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar */}
        <div>
          <p className="text-sm text-gray-600 mb-3">Select a date:</p>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setSelectedTime(null);
            }}
            disabled={(date) =>
              isBefore(date, minDate) || isWeekend(date)
            }
            className={cn("rounded-lg border pointer-events-auto")}
          />
        </div>

        {/* Time Slots */}
        <div>
          <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Select a time:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                disabled={!selectedDate}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-all border",
                  selectedTime === time
                    ? "bg-primary text-white border-primary"
                    : selectedDate
                    ? "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary hover:bg-primary/5"
                    : "bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed"
                )}
              >
                {time}
              </button>
            ))}
          </div>

          {selectedDate && selectedTime && (
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-3">
                Selected: <span className="font-semibold">{format(selectedDate, "MMM d, yyyy")}</span> at <span className="font-semibold">{selectedTime}</span>
              </p>
              <Button
                onClick={handleConfirm}
                variant="gradient"
                size="lg"
                className="w-full"
              >
                Confirm Call
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleCalendar;
