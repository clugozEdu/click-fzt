import PropTypes from "prop-types";
import useUser from "../../context/users";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  Autocomplete,
  Snackbar,
  Alert,
  List,
  ListItem,
  AlertTitle,
} from "@mui/material";
import ControlledDatePicker from "../../layout/components/date-picker";
import ControlledTimePicker from "../../layout/components/time-picker";
import { fetchSupabaseDB, handlerInsertSupabase } from "../../supabaseServices";

const CreateTask = ({ idStatus, idList, setIsDialogOpen }) => {
  const { advisorLogin } = useUser();
  const [priorityTask, setPriorityTask] = useState([]);
  const [dataPost, setDataPost] = useState({
    name_task: "",
    description_task: "",
    start_date: null,
    end_date: null,
    time_task: "",
    status_id: idStatus,
    priority_id: "",
    user_id: advisorLogin.sub,
    list_id: Number(idList),
    is_active: true, // siempre activo al crear
  });

  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchPriority = async () => {
      const { data } = await fetchSupabaseDB("table_priority_task", "*");
      setPriorityTask(data);
    };

    fetchPriority();
  }, []);

  const validate = () => {
    let tempErrors = {};
    tempErrors.name_task = dataPost.name_task
      ? ""
      : "El nombre de la tarea es requerido.";
    tempErrors.start_date = dataPost.start_date
      ? ""
      : "La fecha de inicio es requerida.";
    tempErrors.end_date = dataPost.end_date
      ? ""
      : "La fecha de finalización es requerida.";
    tempErrors.time_task = dataPost.time_task
      ? ""
      : "El tiempo estimado es requerido.";
    tempErrors.priority_id = dataPost.priority_id
      ? ""
      : "La prioridad es requerida.";
    setErrors(tempErrors);

    // Check if there are any errors
    const hasErrors = Object.values(tempErrors).some((x) => x !== "");
    if (hasErrors) {
      setSnackbarOpen(true);
    }

    return !hasErrors;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDataPost((prevDataPost) => ({
      ...prevDataPost,
      [name]: value,
    }));
  };

  const handlePriorityChange = (event, newValue) => {
    setDataPost((prevDataPost) => ({
      ...prevDataPost,
      priority_id: newValue ? newValue.id : "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      handlerInsertSupabase("table_tasks", dataPost);
      setIsDialogOpen(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Creando una nueva tarea
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nombre de la tarea"
              variant="outlined"
              fullWidth
              name="name_task"
              value={dataPost.name_task}
              onChange={handleInputChange}
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: "20px",
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Descripción"
              fullWidth
              variant="outlined"
              name="description_task"
              value={dataPost.description_task}
              onChange={handleInputChange}
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: "20px",
                },
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <ControlledDatePicker
              label="Fecha de inicio"
              name="start_date"
              value={dataPost.start_date}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={6}>
            <ControlledDatePicker
              label="Fecha para finalizar"
              name="end_date"
              value={dataPost.end_date}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={4}>
            <ControlledTimePicker
              label="Tiempo estimado"
              name="time_task"
              value={Number(dataPost.time_task)}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={8}>
            <Autocomplete
              options={priorityTask}
              getOptionLabel={(option) => option.priority_name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seleccione la Prioridad"
                  placeholder="Prioridad"
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: "20px",
                    },
                  }}
                />
              )}
              value={
                priorityTask.find(
                  (option) => option.id === dataPost.priority_id
                ) || null
              }
              onChange={handlePriorityChange}
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 2,
            borderRadius: 5,
          }}
        >
          Crear
        </Button>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%", borderRadius: 5 }}
        >
          <AlertTitle>Error al guardar</AlertTitle>
          <List>
            {Object.values(errors).map((error, index) =>
              error ? <ListItem key={index}>{error}</ListItem> : null
            )}
          </List>
        </Alert>
      </Snackbar>
    </Box>
  );
};

CreateTask.propTypes = {
  idStatus: PropTypes.number.isRequired,
  idList: PropTypes.string.isRequired,
  setIsDialogOpen: PropTypes.func.isRequired,
};

export default CreateTask;
