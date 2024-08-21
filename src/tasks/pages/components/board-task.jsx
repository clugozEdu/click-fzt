import { Grid, Box, Chip, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TaskCard from "../../components/tasks-components/card-tasks";
import {
  backStatusColor,
  getColorsScheme,
  // scrollBarColor,
} from "../../../utils/utilities";

import PropTypes from "prop-types";

const BoardTask = ({
  statusTask,
  groupedTasks,
  stateParent,
  parent,
  handleAddTask,
}) => {
  return (
    <>
      <Grid container spacing={2} rowSpacing={2} ref={stateParent}>
        {statusTask.map((status) => (
          <Grid item xs={12} sm={12} md={4} lg={4} key={status.id}>
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
                <IconButton onClick={() => handleAddTask(status.id)}>
                  <AddIcon
                    sx={{
                      fill: "white",
                    }}
                  />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2} rowSpacing={2} ref={parent}>
        {statusTask.map((status) => (
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            key={status.id}
            sx={{
              maxHeight: 900,
              overflowY: "auto",
              overflowX: "hidden",
              scrollbarWidth: "none",
            }}
          >
            {groupedTasks[status.status_name]?.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isOverdue={task.overdue}
                // setChangeBD={setChangeBD}
              />
            ))}
          </Grid>
        ))}
      </Grid>
    </>
  );
};

BoardTask.propTypes = {
  groupedTasks: PropTypes.object.isRequired,
  parent: PropTypes.func.isRequired,
  stateParent: PropTypes.func.isRequired,
  statusTask: PropTypes.array.isRequired,
  handleAddTask: PropTypes.func.isRequired,
};

export default BoardTask;
