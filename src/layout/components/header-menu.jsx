import PropTypes from "prop-types";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NavLinksBreadcrumbs from "./breadcrumbs";

const HeaderMenu = ({ onViewChange }) => {
  const handleChange = (newValue) => {
    const views = ["board", "list", "calendar"];
    onViewChange(views[newValue]);
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <NavLinksBreadcrumbs />
      </Box>
      <Divider />
      <Box display="flex" justifyContent="flex-start" alignItems="center">
        <IconButton
          onClick={() => handleChange(0)}
          sx={{
            pl: 0,
            "&:hover": {
              backgroundColor: "transparent", // Quitar el efecto de hover
            },
          }}
        >
          <ViewModuleIcon />
        </IconButton>
        <Typography variant="body2">Tablero</Typography>
        <IconButton
          onClick={() => handleChange(1)}
          sx={{
            "&:hover": {
              backgroundColor: "transparent", // Quitar el efecto de hover
            },
          }}
        >
          <ViewListIcon />
        </IconButton>
        <Typography variant="body2">Lista</Typography>
        <IconButton
          onClick={() => handleChange(2)}
          sx={{
            "&:hover": {
              backgroundColor: "transparent", // Quitar el efecto de hover
            },
          }}
        >
          <CalendarMonthIcon />
        </IconButton>
        <Typography variant="body2">Calendario</Typography>
      </Box>
    </>
  );
};

HeaderMenu.propTypes = {
  onViewChange: PropTypes.func.isRequired,
};

export default HeaderMenu;
