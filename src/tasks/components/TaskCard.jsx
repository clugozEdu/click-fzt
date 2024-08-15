import {
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Box,
  IconButton,
  Tooltip,
  Divider,
  Avatar,
} from "@mui/material";
import { Flag } from "@mui/icons-material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";
import {
  priorityColors,
  statusColors,
  getColorsScheme,
  convertHours,
  formatDate,
  stringAvatar,
} from "../../utils/utilities";
import MenuCards from "./menu-cards";

const TaskCard = ({ task }) => {
  // set user name for tooltip
  const userName = `${task.user.first_name} ${task.user.last_name}`;
  // format day to show
  const formattedStartDate = task.start_date
    ? formatDate(task.start_date)
    : null;
  const formattedEndDate = task.end_date ? formatDate(task.end_date) : null;

  // handler edit Task
  const handlerEditTask = (e) => {
    "Edit task", e;
  };

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
        borderColor: getColorsScheme(task.status.status_name, statusColors),
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
            <IconButton
              onClick={(e) => {
                handlerEditTask(e);
              }}
            >
              <EditIcon />
            </IconButton>
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
        <Divider sx={{ mb: 1.5 }} />
        <Typography variant="body1" sx={{ mb: 1.5 }} color="text.secondary">
          {task.description_task || "Descripción no disponible"}
        </Typography>
        {(formattedStartDate || formattedEndDate) && (
          <Box display="flex" alignItems="center" sx={{ mb: 1.5 }}>
            <CalendarMonthIcon sx={{ mr: 1, color: "text.secondary" }} />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {formattedStartDate && formattedEndDate
                ? `Del ${formattedStartDate} al ${formattedEndDate}`
                : formattedStartDate
                ? `Desde ${formattedStartDate}`
                : `Hasta ${formattedEndDate}`}
            </Typography>
          </Box>
        )}
        {task.time_task !== undefined && (
          <Box display="flex" alignItems="center" sx={{ mb: 1.5 }}>
            <ScheduleIcon sx={{ mr: 1, color: "text.secondary" }} />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {convertHours(task.time_task)} hrs
            </Typography>
          </Box>
        )}

        <Grid container spacing={1}>
          <Grid
            item
            xs={12}
            sm={12}
            md={10}
            display={"flex"}
            alignItems={"center"}
          >
            <Chip
              label={task.priority.priority_name}
              icon={<Flag sx={{ fill: "white" }} />}
              sx={{
                backgroundColor: getColorsScheme(
                  task.priority.priority_name,
                  priorityColors
                ),
                color: "white",
                mr: 1,
              }}
            />
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
