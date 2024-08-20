import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Grid, Box, IconButton, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TaskCard from "../components/tasks-components/card-tasks";
import useUser from "../../context/users";
import { fetchTasksForList, fetchSupabaseDB } from "../../supabaseServices";
import {
  backStatusColor,
  getColorsScheme,
  // scrollBarColor,
} from "../../utils/utilities";
import NavLinksBreadcrumbs from "../../layout/components/breadcrumbs";
import CreateDialog from "../../layout/components/create-dialog";
import SnackbarCustom from "../../layout/components/snackbar";
import CreateTask from "../forms/create-tasks";
// import supabase from "../../supabaseClient";
import useLoading from "../../context/loading";
import useSupabaseSubscriptions from "../../hooks/use-supabase-subscriptions";
import { useAutoAnimate } from "@formkit/auto-animate/react";

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
    if (changeBD && tasks.length > 0) {
      setShowSnackbar(true);
    }
  }, [changeBD, tasks]);

  // Funcion para verificar si una tarea esta vencida
  const isTaskOverdue = (dueDate, status_task) => {
    if (status_task === "Realizado") {
      return false;
    }

    const today = new Date();
    const taskDate = new Date(dueDate);
    return taskDate < today;
  };

  // Agrupar tareas por estado
  const groupedTasks = tasks.reduce((acc, task) => {
    const status = task.status.status_name;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push({
      ...task,
      overdue: isTaskOverdue(task.end_date, task.status.status_name),
    });
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
      <NavLinksBreadcrumbs />
      <Grid container spacing={2} rowSpacing={2} ref={stateParent}>
        {statusTask.map((status) => (
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            key={status.id}
            padding={1}
            sx={{
              maxHeight: 900,
              overflowY: "auto",
              overflowX: "hidden",
              scrollbarWidth: "none",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                background: getColorsScheme(
                  status.status_name,
                  backStatusColor
                ),
                marginBottom: 2,
                color: "white",
                borderRadius: 5,
                boxShadow: 3,
              }}
            >
              <Typography
                variant="h6"
                component="div"
                mb={0}
                gutterBottom
                sx={{
                  ml: 2,
                }}
              >
                {status.status_name}
              </Typography>
              <Box display="flex" alignItems="center">
                <Chip
                  label={
                    <Typography variant="h6" component="div">
                      {groupedTasks[status.status_name]?.length || 0}
                    </Typography>
                  }
                  sx={{
                    background: "inherit",
                    color: "white",
                  }}
                />
                <IconButton onClick={(e) => handlerAddTask(status.id, e)}>
                  <AddIcon
                    sx={{
                      fill: "white",
                    }}
                  />
                </IconButton>
              </Box>
            </Box>
            <Box ref={parent}>
              {
                // Mostrar las tareas del estado actual
                groupedTasks[status.status_name]?.map((task) => (
                  <Grid item mb={2} key={task.id}>
                    <TaskCard task={task} isOverdue={task.overdue} />
                  </Grid>
                ))
              }
            </Box>
          </Grid>
        ))}
      </Grid>

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
