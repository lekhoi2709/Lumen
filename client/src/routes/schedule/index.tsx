import Layout from "@/layouts/layout";
import FullCalendar from "@fullcalendar/react";
import EventInput from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format, subHours } from "date-fns";
import { useSchedulesAndAssignments } from "@/services/queries/schedule";
import Loading from "@/components/loading";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SchedulePage() {
  const { data, isLoading, error } = useSchedulesAndAssignments();
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();

  if (isLoading)
    return (
      <Layout>
        <div className="relative z-0 w-full p-4 md:pl-[16rem]">
          <Loading />
        </div>
      </Layout>
    );

  if (error)
    return (
      <Layout>
        <div className="relative z-0 w-full p-4 md:pl-[16rem]">
          <div className="flex h-full w-full items-center justify-center">
            Error loading data
          </div>
        </div>
      </Layout>
    );

  const { schedules, assignments } = data;

  const events: EventInput[] = [
    ...schedules.map((schedule: any) => ({
      title: `${schedule.courseId.title} - ${schedule.startTime} to ${schedule.endTime}`,
      start: `${format(new Date(), "yyyy-MM-dd")}T${schedule.startTime}`,
      end: `${format(new Date(), "yyyy-MM-dd")}T${schedule.endTime}`,
    })),
    ...assignments.map((assignment: any) => {
      const endTime = new Date(assignment.dueDate);
      const startTime = subHours(endTime, 1);
      return {
        title: assignment.title,
        start: startTime,
        end: endTime,
        allDay: false,
        extendedProps: {
          courseId: assignment.courseId,
          _id: assignment._id,
        },
      };
    }),
  ];

  const handleDateClick = (arg: any) => {
    setCurrentDate(arg.date);
  };

  const handleSelect = (info: any) => {
    const courseProps = info.event.extendedProps;
    navigate(`/courses/${courseProps.courseId}/assignments/${courseProps._id}`);
  };

  return (
    <Layout>
      <div className="relative z-0 w-full p-4 md:pl-[16rem]">
        <div className="bg-muted p-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek",
            }}
            events={events}
            dateClick={handleDateClick}
            initialDate={currentDate}
            editable={false}
            eventClick={handleSelect}
            selectable={false}
            selectMirror={true}
            dayMaxEvents={true}
            height={800}
            eventDurationEditable={false}
            eventStartEditable={false}
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            eventColor="#f97316"
          />
        </div>
      </div>
    </Layout>
  );
}

export default SchedulePage;
