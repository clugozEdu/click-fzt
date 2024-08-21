import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridWeek from "@fullcalendar/timegrid";
import timeGridDay from "@fullcalendar/timegrid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import {
  backStatusColor,
  getColorsScheme,
  // scrollBarColor,
} from "../../../utils/utilities";
import TaskCard from "../../components/tasks-components/card-tasks";
import "./calendar-task.css";

// Función para transformar groupTask a eventos de FullCalendar
const transformTaskInEvent = (groupTask) => {
  return groupTask.map((task) => ({
    id: task.id,
    title: `${task.name_task} (${task.status.status_name})`,
    start: task.start_date,
    end: task.end_date,
    backgroundColor: getColorsScheme(task.status.status_name, backStatusColor),
    className: "tasks",
  }));
};

const CalendarTasks = ({ tasks }) => {
  const [events, setEvents] = useState([]);
  const [taskFilter, setTaskFilter] = useState(null);

  useEffect(() => {
    const transformedEvents = transformTaskInEvent(tasks);
    setEvents(transformedEvents);
  }, [tasks]);

  // Función para manejar el clic en un evento
  const handleEventClick = (clickInfo) => {
    const taskId = Number(clickInfo.event.id);
    const task = tasks.find((t) => t.id === taskId);
    setTaskFilter(task);
  };

  const handleClose = () => {
    setTaskFilter(null);
  };

  return (
    <div className="calendar-tasks-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridWeek, timeGridDay]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
      />
      <Dialog open={Boolean(taskFilter)} onClose={handleClose}>
        <DialogContent>
          {taskFilter && <TaskCard task={taskFilter} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

CalendarTasks.propTypes = {
  tasks: PropTypes.array.isRequired,
};

export default CalendarTasks;
