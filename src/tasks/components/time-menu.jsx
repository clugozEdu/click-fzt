/**
 * Componente TimeMenu
 * - Este componente muestra un ícono de reloj y el tiempo de una tarea
 * - Al hacer clic en el ícono, se despliega un menú con opciones de tiempo
 * - El usuario puede seleccionar una opción y esta se actualiza en la base de datos
 * * Props:
 * - task: object - Tarea
 * - task.id: number - ID de la tarea
 * - task.time_task: number - Tiempo de la tarea
 */

import { useState } from "react";
import { Menu, MenuItem, Typography } from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PropTypes from "prop-types";
import { convertHours } from "../../utils/utilities";
import { timeOptions } from "../../utils/utilities";
import { handlerUpdateBD } from "../../supabaseServices";

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
