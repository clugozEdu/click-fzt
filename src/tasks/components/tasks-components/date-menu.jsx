import { useState } from "react";
import { Typography, Menu, MenuItem, Box } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { formatDate } from "../../../utils/utilities";
import { handlerUpdateBD } from "../../../supabaseServices";

const DateMenuCard = ({ date, text, taskID, keyUpdate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dateVisit, setDateVisit] = useState(date);

  // Formatear la fecha para mostrarla en el componente
  const formattedDate = date ? formatDate(date) : null;

  const handleDateChange = (newValue) => {
    // Actualizar el estado de la fecha
    setDateVisit(newValue);
    const columnUpdate = {
      [keyUpdate]: newValue ? newValue.format("YYYY/MM/DD") : "",
    };

    // Actualizar la base de datos
    handlerUpdateBD("table_tasks", columnUpdate, taskID);
    // Cerrar el menú después de seleccionar una fecha
    handleMenuClose();
  };

  // Mostrar el menú al hacer clic en el icono
  const handleIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Cerrar el menú
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box display="flex" alignItems="center">
        <CalendarMonthIcon
          sx={{ mr: 1, color: "text.secondary", cursor: "pointer" }}
          onClick={handleIconClick}
        />
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {text} {formattedDate}
        </Typography>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <MenuItem
          sx={{
            "&:hover": {
              backgroundColor: "transparent", // Quitar el efecto de hover
            },
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              views={["day"]}
              value={dateVisit ? dayjs(dateVisit, "YYYY/MM/DD") : null}
              onChange={handleDateChange}
            />
          </LocalizationProvider>
        </MenuItem>
      </Menu>
    </>
  );
};

// Validar las props del componente
DateMenuCard.propTypes = {
  date: PropTypes.string.isRequired,
  text: PropTypes.string,
  taskID: PropTypes.number.isRequired,
  keyUpdate: PropTypes.string.isRequired,
};

export default DateMenuCard;
