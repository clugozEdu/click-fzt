import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Divider } from "@mui/material";
import useUser from "../../context/users";
import useLoading from "../../context/loading";
import { fetchTasksForList, fetchSupabaseDB } from "../../supabaseServices";
import CreateDialog from "../../layout/components/create-dialog";
import SnackbarCustom from "../../layout/components/snackbar";
import CreateTask from "../forms/create-tasks";
import useSupabaseSubscriptions from "../../hooks/use-supabase-subscriptions";
import HeaderMenu from "../../layout/components/header-menu";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import BoardTask from "./components/board-task";
import ListTask from "./components/lists-task";
import CalendarTasks from "./components/calendar-task";
import dayjs from "dayjs";

const TaskPage = () => {
  const { advisorLogin } = useUser();
  const { listId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [statusTask, setStatusTask] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [changeBD, setChangeBD] = useState(false);
  const [saveIdStatus, setSaveIdStatus] = useState(0);
  const { setIsLoading } = useLoading();
  const [parent] = useAutoAnimate(); // Hook para animar el contenedor
  const [stateParent] = useAutoAnimate(); // Hook para animar el contenedor principal de los estados
  const [currentView, setCurrentView] = useState("board"); // Estado para la vista actual

  // Carga de tareas - callback
  const loadTask = useCallback(async () => {
    setIsLoading(true);
    const fetchDataTask = fetchTasksForList(listId, advisorLogin.sub);
    const fetchStatusTask = fetchSupabaseDB("table_status_taks", "*");

    const [tasksFeth, dataStatusTask] = await Promise.all([
      fetchDataTask,
      fetchStatusTask,
    ]);

    setTasks(tasksFeth.data || []);
    setStatusTask(dataStatusTask.data || []);

    setIsLoading(false);
  }, [advisorLogin.sub, listId, setIsLoading]);

  // Función para manejar los eventos de la base de datos
  const handleEvent = useCallback(
    (tableName, payload) => {
      console.log(`Received an event on ${tableName}:`, payload);
      loadTask();
      setChangeBD(true);

      if (payload.eventType === "INSERT") {
        setSnackbarMessage("creada exitosamente");
      } else if (payload.eventType === "UPDATE") {
        setSnackbarMessage("actualizada");
      } else if (payload.eventType === "DELETE") {
        setSnackbarMessage("eliminada");
      }
    },
    [loadTask]
  );

  // Configuración de las suscripciones a cambios en la base de datos
  useSupabaseSubscriptions([{ tableName: "table_tasks" }], handleEvent);

  // Cargar los datos iniciales cuando el asesor cambie
  useEffect(() => {
    if (advisorLogin && advisorLogin.sub) {
      loadTask();
    }
  }, [advisorLogin, loadTask]);

  // Mostrar Snackbar cuando se actualiza la base de datos
  useEffect(() => {
    if (changeBD) {
      setShowSnackbar(true);
      // Resetear el estado después de mostrar el Snackbar
      setChangeBD(false);
    }
  }, [changeBD]);

  // Funcion para verificar si una tarea esta vencida
  const isTaskOverdue = (dueDate, status_task) => {
    if (status_task === "Realizado") {
      return false;
    }

    // validar con dayjs
    const today = dayjs();
    const due = dayjs(dueDate);
    return today.isAfter(due, "day");
  };

  // Agrupar y ordenar tareas por estado y fecha de vencimiento
  const groupedTasks = tasks
    .map((task) => ({
      ...task,
      overdue: isTaskOverdue(task.end_date, task.status.status_name),
    }))
    .sort((a, b) => dayjs(a.end_date).diff(dayjs(b.end_date)))
    .reduce((acc, task) => {
      const status = task.status.status_name;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(task);
      return acc;
    }, {});

  const handlerAddTask = (idStatus) => {
    setIsDialogOpen(true);
    setSaveIdStatus(idStatus);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <HeaderMenu onViewChange={setCurrentView} />

      <Divider sx={{ mb: 2 }} />
      {currentView === "board" && (
        <BoardTask
          groupedTasks={groupedTasks}
          statusTask={statusTask}
          stateParent={stateParent}
          parent={parent}
          handleAddTask={handlerAddTask}
        />
      )}
      {currentView === "list" && (
        <ListTask
          groupedTasks={groupedTasks}
          statusTask={statusTask}
          handleAddTask={handlerAddTask}
        />
      )}
      {currentView === "calendar" && <CalendarTasks tasks={tasks} />}
      <CreateDialog open={isDialogOpen} onClose={handleCloseDialog}>
        <CreateTask
          idStatus={saveIdStatus}
          idList={listId}
          setIsDialogOpen={setIsDialogOpen}
        />
      </CreateDialog>
      {showSnackbar && (
        <SnackbarCustom
          open={showSnackbar}
          message={`${advisorLogin.fullname} ha ${snackbarMessage} una tarea`}
          title={"Completado"}
          onCloseHandler={() => {
            setShowSnackbar(false);
          }}
          duration={3000}
          severity="success"
          vertical="bottom"
          horizontal="left"
        />
      )}
    </Box>
  );
};

export default TaskPage;
