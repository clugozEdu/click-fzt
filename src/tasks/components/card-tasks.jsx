/**
 * Componente TaskCard
 * - Este componente muestra la información de una tarea en una tarjeta
 * - El usuario puede ver la información de la tarea
 * - El usuario puede editar la información de la tarea
 * - El usuario puede eliminar la tarea
 * * Props:
 * - task: object - Tarea
 * - task.id: number - ID de la tarea
 * - task.name_task: string - Nombre de la tarea
 * - task.description_task: string - Descripción de la tarea
 * - task.start_date: string - Fecha de inicio de la tarea
 * - task.end_date: string - Fecha de fin de la tarea
 * - task.time_task: number - Tiempo de la tarea
 * - task.priority: object - Prioridad de la tarea
 * - task.priority.priority_name: string - Nombre de la prioridad
 * - task.status: object - Estado de la tarea
 * - task.status.id: number - ID del estado de la tarea
 * - task.status.status_name: string - Nombre del estado de la tarea
 * - task.user: object - Usuario asignado a la tarea
 * - task.user.first_name: string - Nombre del usuario asignado a la tarea
 * - task.user.last_name: string - Apellido del usuario asignado a la tarea
 * * Dependencias:
 * - statusColors: object - Colores de los estados de las tareas
 * - getColorsScheme: function - Función para obtener el color de un estado
 * - stringAvatar: function - Función para obtener las iniciales de un nombre
 * - MenuCards: component - Componente
 * - PriorityChip: component - Componente
 * - TimeMenu: component - Componente
 * - DateMenuCard: component - Componente
 * - DescriptionMenuCard: component - Componente
 */

import {
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Box,
  IconButton,
  Tooltip,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";
import {
  statusColors,
  getColorsScheme,
  stringAvatar,
} from "../../utils/utilities";
import MenuCards from "./menu-cards";
import PriorityChip from "./priority-chip";
import TimeMenu from "./time-menu";
import DateMenuCard from "./date-menu";
import DescriptionMenuCard from "./description-menu";

const TaskCard = ({ task }) => {
  // set user name for tooltip
  const userName = `${task.user.first_name} ${task.user.last_name}`;

  // handler delete Task
  const handlerDeleteTask = (e) => {
    console.log("Delete task", e);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        maxHeight: 400,
        borderRadius: 5,
        boxShadow: 4,
      }}
    >
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Typography variant="h6" component="div" margin={0} gutterBottom>
            {task.name_task}
          </Typography>

          {/* {task.status.status_name !== "Realizado" && ( */}
          <Box display="flex">
            {/* <IconButton
              onClick={(e) => {
                handlerEditTask(e);
              }}
            >
              <EditIcon />
            </IconButton> */}
            <IconButton
              onClick={(e) => {
                handlerDeleteTask(e);
              }}
            >
              <DeleteIcon />
            </IconButton>
            <MenuCards idStatus={task.status.id} taskId={task.id} />
          </Box>
          {/* )} */}
        </Box>

        {/* <Divider sx={{ mb: 1.5 }} /> */}

        {/* Description task */}
        <Box display="flex" alignItems="center" sx={{ mb: 1.5 }}>
          <DescriptionMenuCard
            description={task.description_task}
            taskID={task.id}
          />
        </Box>

        {/* Date start and end */}
        <Box display="flex" alignItems="center" sx={{ mb: 1.5 }}>
          <DateMenuCard
            date={task.start_date}
            text={"Inicio: "}
            taskID={task.id}
            keyUpdate={"start_date"}
          />
          <Box sx={{ mx: 1 }} />
          <DateMenuCard
            date={task.end_date}
            text={"Fin: "}
            taskID={task.id}
            keyUpdate={"end_date"}
          />
        </Box>

        {/* Time task */}
        <Box
          display="flex"
          alignItems="center"
          sx={{ mb: 1.5 }} // Añadir cursor: pointer
        >
          <TimeMenu task={task} />
        </Box>

        <Grid container spacing={1}>
          <Grid
            item
            xs={12}
            sm={12}
            md={10}
            display={"flex"}
            alignItems={"center"}
          >
            <PriorityChip priority={task.priority} idTask={task.id} />

            <Chip
              label={task.status.status_name}
              sx={{
                backgroundColor: getColorsScheme(
                  task.status.status_name,
                  statusColors
                ),
                color: "white",
                mr: 1,
              }}
            />
            <Tooltip title={userName}>
              <Avatar
                sx={{ width: 32, height: 32, marginRight: 1 }}
                {...stringAvatar(userName)}
              />
            </Tooltip>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name_task: PropTypes.string.isRequired,
    description_task: PropTypes.string,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    time_task: PropTypes.number,
    priority: PropTypes.shape({
      priority_name: PropTypes.string.isRequired,
    }).isRequired,
    status: PropTypes.shape({
      id: PropTypes.number.isRequired,
      status_name: PropTypes.string.isRequired,
    }).isRequired,
    user: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
    }),
  }).isRequired,
};

export default TaskCard;
