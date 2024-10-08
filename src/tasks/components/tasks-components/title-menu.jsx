import { useState } from "react";
import {
  Box,
  Menu,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import PropTypes from "prop-types";
import { handlerUpdateBD } from "../../../supabaseServices";
import { Title } from "@mui/icons-material";

const TitleMenu = ({ task }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [newTitle, setNewTitle] = useState(task.name_task);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setNewTitle(task.name_task); // Reiniciar el título al abrir el menú
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUpdateTitle = () => {
    const columnUpdate = {
      name_task: newTitle,
    };
    handlerUpdateBD("table_tasks", columnUpdate, task.id);
    handleMenuClose();
  };

  return (
    <>
      <Box display={"flex"} alignItems={"center"}>
        <Title
          onClick={handleMenuClick}
          sx={{
            mr: 1,
            color: "text.secondary",
            cursor: "pointer",
          }}
        />
        <Divider
          orientation={"vertical"}
          flexItem
          sx={{
            mr: 1,
          }}
        />
        <Typography variant={"h6"} color={"text.secondary"}>
          {task.name_task}
        </Typography>
      </Box>
      <Menu
        id="menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <Box p={2}>
          <TextField
            label="Nuevo Título"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            fullWidth
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: "20px",
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateTitle}
            sx={{ mt: 2, borderRadius: 2 }}
          >
            Actualizar Título
          </Button>
        </Box>
      </Menu>
    </>
  );
};

// Validar las props del componente
TitleMenu.propTypes = {
  task: PropTypes.object.isRequired,
};

export default TitleMenu;
