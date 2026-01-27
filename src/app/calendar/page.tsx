const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function buildCalendar(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday start
  const totalDays = lastDay.getDate();

  const cells: Array<number | null> = Array.from({ length: startOffset }, () => null);
  for (let day = 1; day <= totalDays; day++) {
    cells.push(day);
  }
  return { year, month, cells };
}

export default function CalendarPage() {
  const { year, month, cells } = buildCalendar();
  const monthLabel = new Date(year, month, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-neutral-900">Calendar</h1>
        <p className="text-sm text-neutral-500">Monthly overview.</p>
      </div>

      <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
        <div className="mb-4 text-lg font-semibold text-neutral-900">
          {monthLabel}
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-neutral-500">
          {daysOfWeek.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-2 text-center">
          {cells.map((day, index) => {
            const isToday = isCurrentMonth && day === today.getDate();
            return (
              <div
                key={`${day ?? "empty"}-${index}`}
                className={`h-16 rounded-xl border text-sm flex items-center justify-center ${
                  day
                    ? "bg-neutral-50 border-neutral-200"
                    : "bg-transparent border-transparent"
                } ${
                  isToday
                    ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-md"
                    : ""
                }`}
              >
                {day ?? ""}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
