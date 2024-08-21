import {
  Card,
  CardContent,
  Chip,
  Grid,
  Box,
  IconButton,
  Tooltip,
  Avatar,
  Divider,
} from "@mui/material";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";
import {
  statusColors,
  getColorsScheme,
  stringAvatar,
} from "../../../utils/utilities";
import MenuCards from "./menu-cards";
import PriorityChip from "./priority-chip";
import TitleMenu from "./title-menu";
import TimeMenu from "./time-menu";
import DateMenuCard from "./date-menu";
import DescriptionMenuCard from "./description-menu";
import { handlerUpdateBD } from "../../../supabaseServices";

const TaskCard = ({ task, isOverdue }) => {
  // set user name for tooltip
  const userName = `${task.user.first_name} ${task.user.last_name}`;

  // handler delete Task
  const handlerDeleteTask = () => {
    const column = {
      is_active: false,
    };

    handlerUpdateBD("table_tasks", column, task.id);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        maxHeight: 400,
        borderRadius: 5,
        boxShadow: 2,
        marginBottom: 2,
      }}
    >
      <CardContent>
        <Grid container spacing={1.5}>
          <Grid
            item
            xs={12}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* Name task*/}
            <TitleMenu task={task} />

            {/* Buttons */}
            <Box display="flex">
              <IconButton onClick={() => handlerDeleteTask()}>
                <DeleteIcon />
              </IconButton>
              <MenuCards idStatus={task.status.id} taskId={task.id} />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Description task */}
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <DescriptionMenuCard
              description={task.description_task}
              taskID={task.id}
            />
          </Grid>

          {/* Date start task */}
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <DateMenuCard
              date={task.start_date}
              text={"Inicio: "}
              taskID={task.id}
              keyUpdate={"start_date"}
            />
          </Grid>
          {/* Date end task */}
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <DateMenuCard
              date={task.end_date}
              text={"Fin: "}
              taskID={task.id}
              keyUpdate={"end_date"}
            />
          </Grid>

          {/* Time task */}
          <Grid item xs={12}>
            <TimeMenu task={task} />
          </Grid>

          <Grid item xs={12} sm={12} display="flex" alignItems="center">
            {/* Overdue task */}
            {isOverdue && (
              <Chip
                label="Atrasada"
                icon={
                  <EventBusyIcon
                    sx={{
                      fill: "white",
                    }}
                  />
                }
                sx={{
                  backgroundColor: "#FF3D3D",
                  color: "white",
                  mr: 1,
                }}
              />
            )}
            {/* Priority task */}
            <PriorityChip priority={task.priority} idTask={task.id} />
            {/* Status task */}
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
            {/* User task */}
            <Tooltip title={userName}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  marginRight: 1,
                }}
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
  isOverdue: PropTypes.bool,
};

export default TaskCard;
