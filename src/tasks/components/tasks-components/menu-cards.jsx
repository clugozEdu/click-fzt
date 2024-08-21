import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Menu, MenuItem, IconButton } from "@mui/material";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { handlerUpdateBD } from "../../../supabaseServices";

const initialItemsMenu = [
  {
    id: 1,
    label: "Backlog",
  },
  {
    id: 2,
    label: "En Progreso",
  },
  {
    id: 3,
    label: "Realizada",
  },
];

const MenuCards = ({ taskId, idStatus }) => {
  const [itemsMenu, setItemsMenu] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  // filter data from menu
  useEffect(() => {
    if (idStatus) {
      setItemsMenu(initialItemsMenu.filter((item) => item.id !== idStatus));
    }
  }, [idStatus]);

  const handleMenuClick = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const onClickHandler = (e) => {
    const columnUpdate = {
      status_id: Number(e.target.id),
    };
    handlerUpdateBD("table_tasks", columnUpdate, taskId);
    handleMenuClose();
  };

  return (
    <>
      <IconButton
        onClick={(event) => {
          handleMenuClick(event);
        }}
      >
        <SyncAltIcon />
      </IconButton>
      <Menu
        id="menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {itemsMenu.map((item, index) => (
          <MenuItem
            key={index}
            id={item.id}
            onClick={(e) => {
              onClickHandler(e);
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

MenuCards.propTypes = {
  idStatus: PropTypes.number,
  taskId: PropTypes.number,
};

export default MenuCards;
