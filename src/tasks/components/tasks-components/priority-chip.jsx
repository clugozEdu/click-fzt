/**
 * Componente PriorityChip
 * - Este componente muestra un chip con la prioridad de una tarea
 * - Al hacer clic en el chip, se despliega un menú con opciones de prioridad
 * - El usuario puede seleccionar una opción y esta se actualiza en la base de datos
 * * Props:
 * - priority: object - Prioridad de la tarea
 * - priority.id: number - ID de la prioridad
 * - priority.priority_name: string - Nombre de la prioridad
 * - idTask: number - ID de la tarea
 * * Dependencias:
 * - initialItemsMenu: array - Arreglo con las opciones de prioridad
 */

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Chip, MenuItem, Menu } from "@mui/material";
import { Flag } from "@mui/icons-material";
import { getColorsScheme, priorityColors } from "../../../utils/utilities";
import { handlerUpdateBD } from "../../../supabaseServices";

// Opciones de prioridad
const initialItemsMenu = [
  {
    id: 1,
    label: "Alta",
  },
  {
    id: 2,
    label: "Baja",
  },
  {
    id: 3,
    label: "Media",
  },
  {
    id: 4,
    label: "Urgente",
  },
];

const PriorityChip = ({ priority, idTask }) => {
  const [itemsMenu, setItemsMenu] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  // Actualizar el estado de las opciones de prioridad
  useEffect(() => {
    if (priority) {
      setItemsMenu(initialItemsMenu.filter((item) => item.id !== priority.id));
    }
  }, [priority]);

  // Mostrar el menú al hacer clic en el chip
  const handleMenuClick = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  // Cerrar el menú de prioridades
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Actualizar la prioridad de la tarea
  const handlePriorityUpdate = (e) => {
    const columnUpdate = {
      priority_id: Number(e.target.id),
    };
    // Actualizar la base de datos
    handlerUpdateBD("table_tasks", columnUpdate, idTask);
    handleMenuClose();
  };

  return (
    <>
      <Chip
        label={priority.priority_name}
        icon={
          <Flag
            sx={{
              fill: "white",
            }}
          />
        }
        onClick={(e) => handleMenuClick(e)}
        sx={{
          backgroundColor: getColorsScheme(
            priority.priority_name,
            priorityColors
          ),
          "&:hover": {
            backgroundColor: getColorsScheme(
              priority.priority_name,
              priorityColors
            ), // Mantener el color de fondo original
          },
          color: "white",
          mr: 1,
        }}
      />
      <Menu
        id="menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{}}
      >
        {itemsMenu.map((item) => (
          <MenuItem
            id={item.id}
            key={item.id}
            onClick={(e) => {
              handlePriorityUpdate(e);
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

// Validar props del componente PriorityChip
PriorityChip.propTypes = {
  priority: PropTypes.object.isRequired,
  idTask: PropTypes.number.isRequired,
};

export default PriorityChip;
