// // src/pages/DashboardPage.jsx
// // COMPLETE REPLACEMENT — adds entry count dots to calendar
// import { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { motion, AnimatePresence } from "framer-motion";
// import toast from "react-hot-toast";

// import { calendarApi } from "../utils/api";
// import DayPanel from "../components/DayPanel";
// import StatsBar from "../components/StatsBar";
// import SearchModal from "../components/SearchModal";
// import Layout from "../components/Layout";

// export default function DashboardPage() {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [calendarSummary, setCalendarSummary] = useState({});
//   const [showSearch, setShowSearch] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [currentMonth, setCurrentMonth] = useState({
//     year: new Date().getFullYear(),
//     month: new Date().getMonth() + 1,
//   });

//   const calendarRef = useRef(null);

//   const fetchSummary = useCallback(async (year, month) => {
//     try {
//       setLoading(true);
//       const res = await calendarApi.getSummary(year, month);
//       setCalendarSummary(res.data.summary || {});
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load calendar");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchSummary(currentMonth.year, currentMonth.month);
//   }, [currentMonth, fetchSummary]);

//   const handleDatesSet = (dateInfo) => {
//     const mid = new Date(
//       (dateInfo.start.getTime() + dateInfo.end.getTime()) / 2
//     );
//     const newMonth = { year: mid.getFullYear(), month: mid.getMonth() + 1 };
//     if (newMonth.year !== currentMonth.year || newMonth.month !== currentMonth.month) {
//       setCurrentMonth(newMonth);
//     }
//   };

//   const handleDateClick = (info) => setSelectedDate(info.dateStr);

//   const handleDayPanelChange = useCallback(() => {
//     fetchSummary(currentMonth.year, currentMonth.month);
//   }, [currentMonth, fetchSummary]);

//   // Build calendar events from summary — includes entries
//   const calendarEvents = useMemo(() => {
//     return Object.entries(calendarSummary).flatMap(([date, counts]) => {
//       const events = [];

//       if (counts.entries) {
//         events.push({
//           id: `${date}-e`,
//           date,
//           title: `📋 ${counts.entries} ${counts.entries === 1 ? 'Entry' : 'Entries'}`,
//           color: "#4f46e5", // indigo
//           order: 0,
//         });
//       }
//       if (counts.memos) {
//         events.push({
//           id: `${date}-m`,
//           date,
//           title: `📄 ${counts.memos} Memo${counts.memos > 1 ? 's' : ''}`,
//           color: "#2563eb", // blue
//           order: 1,
//         });
//       }
//       if (counts.activities) {
//         events.push({
//           id: `${date}-a`,
//           date,
//           title: `📝 ${counts.activities} Activity`,
//           color: "#16a34a", // green
//           order: 2,
//         });
//       }
//       if (counts.files) {
//         events.push({
//           id: `${date}-f`,
//           date,
//           title: `📎 ${counts.files} File${counts.files > 1 ? 's' : ''}`,
//           color: "#9333ea", // purple
//           order: 3,
//         });
//       }

//       return events;
//     });
//   }, [calendarSummary]);

//   return (
//     <Layout onSearch={() => setShowSearch(true)}>
//       <div className="flex flex-col h-screen">
//         <StatsBar />

//         <div className="flex flex-1 gap-4 mt-4 min-h-0">
//           {/* Calendar */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className={`card p-4 relative transition-all duration-300 ${
//               selectedDate ? 'flex-1' : 'w-full'
//             }`}
//             style={{ height: '80vh' }}
//           >
//             <FullCalendar
//               ref={calendarRef}
//               plugins={[dayGridPlugin, interactionPlugin]}
//               initialView="dayGridMonth"
//               events={calendarEvents}
//               dateClick={handleDateClick}
//               eventClick={(info) => setSelectedDate(info.event.startStr)}
//               datesSet={handleDatesSet}
//               headerToolbar={{
//                 left: "prev",
//                 center: "title",
//                 right: "next today",
//               }}
//               height="100%"
//               dayMaxEvents={3}
//               dayCellClassNames={(arg) => {
//                 const key = arg.date.toISOString().split("T")[0];
//                 return calendarSummary[key] ? "has-entries" : "";
//               }}
//             />

//             {loading && (
//               <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-slate-400 text-sm rounded-xl">
//                 <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-2" />
//                 Loading…
//               </div>
//             )}
//           </motion.div>

//           {/* Day Panel */}
//           <AnimatePresence>
//             {selectedDate && (
//               <motion.div
//                 key="day-panel"
//                 initial={{ opacity: 0, x: 24 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: 24 }}
//                 transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
//                 className="w-[440px] flex-shrink-0 flex flex-col"
//                 style={{ height: '80vh' }}
//               >
//                 <DayPanel
//                   date={selectedDate}
//                   onClose={() => setSelectedDate(null)}
//                   onChange={handleDayPanelChange}
//                 />
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>

//       <AnimatePresence>
//         {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
//       </AnimatePresence>
//     </Layout>
//   );
// }

// src/pages/DashboardPage.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import { calendarApi } from "../utils/api";
import DayPanel from "../components/DayPanel";
import StatsBar from "../components/StatsBar";
import SearchModal from "../components/SearchModal";
import Layout from "../components/Layout";

const today = new Date().toISOString().split("T")[0];

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(today);
  const [calendarSummary, setCalendarSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const [currentMonth, setCurrentMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const fetchSummary = useCallback(async (year, month) => {
    try {
      setLoading(true);
      const res = await calendarApi.getSummary(year, month);
      setCalendarSummary(res.data.summary || {});
    } catch {
      toast.error("Failed to load calendar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary(currentMonth.year, currentMonth.month);
  }, [currentMonth]);

  const handleDatesSet = (info) => {
    const mid = new Date((info.start.getTime() + info.end.getTime()) / 2);
    const newMonth = { year: mid.getFullYear(), month: mid.getMonth() + 1 };

    if (
      newMonth.year !== currentMonth.year ||
      newMonth.month !== currentMonth.month
    ) {
      setCurrentMonth(newMonth);
    }
  };

  const calendarEvents = useMemo(() => {
    return Object.entries(calendarSummary).flatMap(([date, c]) => [
      c.memos && { date, title: `${c.memos}M`, color: "#3b82f6" },
      c.activities && { date, title: `${c.activities}A`, color: "#10b981" },
      c.files && { date, title: `${c.files}F`, color: "#9333ea" },
    ].filter(Boolean));
  }, [calendarSummary]);

  return (
    <Layout onSearch={() => setShowSearch(true)}>
      <div className="flex flex-col h-screen">
        <StatsBar />

        <div className="flex flex-1 gap-4 mt-4 px-2">
          {/* Calendar */}
          <motion.div
            className="card flex-1 p-4 h-[85vh] relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={calendarEvents}
              dateClick={(e) => setSelectedDate(e.dateStr)}
              datesSet={handleDatesSet}
              height="100%"
              dayMaxEvents
              headerToolbar={{
                left: "prev",
                center: "title",
                right: "next today",
              }}
              dayCellContent={(arg) => (
                <div className="flex items-center justify-center w-full h-full font-medium text-sm">
                  {arg.dayNumberText.replace("日", "")}
                </div>
              )}
            />

            {loading && (
              <div className="absolute inset-0 bg-white/50 dark:bg-black/40 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent animate-spin rounded-full" />
              </div>
            )}
          </motion.div>

          {/* Right Panel */}
          <AnimatePresence>
            {selectedDate && (
              <motion.div
                className="w-[480px] h-[85vh]"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 30, opacity: 0 }}
              >
                <DayPanel
                  date={selectedDate}
                  onClose={() => setSelectedDate(null)}
                  onChange={() =>
                    fetchSummary(currentMonth.year, currentMonth.month)
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showSearch && (
            <SearchModal onClose={() => setShowSearch(false)} />
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
