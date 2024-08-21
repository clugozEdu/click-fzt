import { useState } from "react";
import { Menu, MenuItem, Typography, Box } from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PropTypes from "prop-types";
import { convertHours, timeOptions } from "../../../utils/utilities";
import { handlerUpdateBD } from "../../../supabaseServices";

const TimeMenu = ({ task }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUpdateTime = (value) => {
    const columnUpdate = {
      time_task: value,
    };
    handlerUpdateBD("table_tasks", columnUpdate, task.id);
    handleMenuClose();
  };

  return (
    <>
      <Box display="flex" alignItems="center">
        <ScheduleIcon
          onClick={handleMenuClick}
          sx={{
            mr: 1,
            color: "text.secondary",
            cursor: "pointer",
          }}
        />
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {convertHours(task.time_task)} hrs
        </Typography>
      </Box>

      <Menu
        id="menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {timeOptions.map((option, index) => (
          <MenuItem key={index} onClick={() => handleUpdateTime(option.value)}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

TimeMenu.propTypes = {
  task: PropTypes.object.isRequired,
};

export default TimeMenu;
