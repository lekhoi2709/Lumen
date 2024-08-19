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
import { twMerge } from "tailwind-merge";

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
            eventContent={CustomEvent}
          />
        </div>
      </div>
    </Layout>
  );
}

function CustomEvent(info: any) {
  const isDayGrid = info.view.type === "dayGridMonth";
  const isTimeGrid = info.view.type === "timeGridWeek";

  const addOneHourToTimeText = (timeText: string) => {
    const [hours, minutes] = timeText.split(":").map(Number);
    const date = new Date();

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    date.setHours(date.getHours() + 1);

    const updatedHours = date.getHours().toString().padStart(2, "0");
    const updatedMinutes = date.getMinutes().toString().padStart(2, "0");

    return `${updatedHours}:${updatedMinutes}`;
  };

  return (
    <div
      className={twMerge(
        "h-full w-full cursor-pointer truncate rounded-md p-1",
        isTimeGrid &&
          "bg-orange-500 transition-shadow duration-200 ease-in-out hover:shadow-xl",
        isDayGrid && "",
      )}
    >
      {isDayGrid && (
        <div className="w-full">
          <span className="relative inline-flex items-center pl-5 before:absolute before:left-0 before:top-1/2 before:h-2 before:w-2 before:-translate-y-1/2 before:rounded-full before:bg-orange-500 before:content-['']">
            <p className="hidden md:inline-block">
              {addOneHourToTimeText(info.timeText)}{" "}
            </p>
            <strong className="font-bold">
              <p className="mx-1 hidden md:inline-block">{" - "}</p>
              {info.event.title}
            </strong>
          </span>
        </div>
      )}
      {isTimeGrid && (
        <div className="flex max-h-full flex-col items-center">
          <span className="w-full truncate">
            {info.timeText.split(" - ")[1]}
          </span>
          <strong className="w-full truncate font-bold">
            {info.event.title}
          </strong>
        </div>
      )}
    </div>
  );
}

export default SchedulePage;
