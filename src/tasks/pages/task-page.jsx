import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Grid, Box, IconButton, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TaskCard from "../components/card-tasks";
import useUser from "../../context/users";
import { fetchTasksForList, fetchSupabaseDB } from "../../supabaseServices";
import { backStatusColor, getColorsScheme } from "../../utils/utilities";
import NavLinksBreadcrumbs from "../../layout/components/breadcrumbs";
import CreateDialog from "../../layout/components/create-dialog";
import SnackbarCustom from "../../layout/components/snackbar";
import CreateTask from "./create-tasks";
import supabase from "../../supabaseClient";
import useLoading from "../../context/loading";

const TaskPage = () => {
  const { advisorLogin } = useUser();
  const { listId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [statusTask, setStatusTask] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [changeBD, setChangeBD] = useState(false);
  const [saveIdStatus, setSaveIdStatus] = useState(0);
  const { setIsLoading } = useLoading();

  // Lógica para cargar las tareas basadas en spacingId y listId
  useEffect(() => {
    const loadTask = async () => {
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
    };

    // callback para cargar las tareas
    loadTask();

    // Configuración de la suscripción a cambios de la base de datos
    const channel = supabase
      .channel("schema-db-task-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "table_tasks" },
        (payload) => {
          console.log("Received an insert:", payload);
          loadTask();
          setChangeBD(true);
        }
      )
      .subscribe();

    // Limpieza de la suscripción
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
        setTimeout(() => {
          setShowSnackbar(false);
        }, 3000);
      }
    };
  }, [advisorLogin.sub, listId, setIsLoading]);

  // Mostrar Snackbar cuando se actualiza la base de datos
  useEffect(() => {
    if (changeBD && tasks.length > 0) {
      setShowSnackbar(true);
    }
  }, [changeBD, tasks]);

  // Agrupar tareas por estado
  const groupedTasks = tasks.reduce((acc, task) => {
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
      <NavLinksBreadcrumbs />
      <Grid container spacing={2} rowSpacing={2}>
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
              maxHeight: 1000,
              overflowY: "auto",
              overflowX: "hidden",
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
            {
              // Mostrar las tareas del estado actual

              groupedTasks[status.status_name]?.map((task) => (
                <Grid item mb={2} key={task.id}>
                  <TaskCard task={task} />
                </Grid>
              ))
            }
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
          message={"Tareas actualizadas con éxito"}
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
