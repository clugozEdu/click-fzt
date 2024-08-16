import { useEffect, useState } from "react";
import {
  List,
  ListItemText,
  ListItemButton,
  Collapse,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Folder,
  FolderOpen,
  CreateNewFolder,
  Home,
  MoreVert,
  Add,
  Delete,
} from "@mui/icons-material";
import ListIcon from "@mui/icons-material/List";
import PropTypes from "prop-types";
import { Link, Navigate } from "react-router-dom";
import useUser from "../../context/users";
import ConfirmDelete from "../../tasks/components/deleted-component";

const ListSideBar = ({
  spacings,
  onCreateSpacing,
  onCreateList,
  onDeleteSpacing,
}) => {
  const [open, setOpen] = useState({});
  const { advisorLogin } = useUser();
  const [spacingData, setSpacingData] = useState([]);
  const [isResposible, setIsResponsible] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSpacing, setSelectedSpacing] = useState(null);
  const [deleteListId, setDeleteListId] = useState(null);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (spacings) {
      setSpacingData(spacings);
      setIsResponsible(
        spacingData.some(
          (spacing) => spacing.user_responsible_id === advisorLogin.sub
        )
      );
    }
  }, [spacingData, spacings, advisorLogin]);

  const handleClick = (id) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [id]: !prevOpen[id],
    }));
  };

  const handleMenuClick = (event, spacingId) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setSelectedSpacing(spacingId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSpacing(null);
  };

  const handleAddClick = () => {
    onCreateList(selectedSpacing);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    onDeleteSpacing(selectedSpacing);
    handleMenuClose();
  };

  const handleDeleteList = (e, idList) => {
    e.preventDefault();
    setDeleteListId(idList);
  };

  const renderSpacings = (spacings) => {
    return (
      <div>
        {spacings.map((spacing) => (
          <div key={spacing.id} style={{ paddingLeft: 1 }}>
            <ListItemButton component={Link} to={`/spacings/${spacing.id}`}>
              {open[spacing.id] ? <FolderOpen /> : <Folder />}
              <ListItemText primary={spacing.name_spacing} sx={{ pl: 1 }} />
              <IconButton
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(spacing.id);
                }}
              >
                {open[spacing.id] ? <ExpandLess /> : <ExpandMore />}
              </IconButton>

              <IconButton
                edge="end"
                onClick={(e) => handleMenuClick(e, spacing.id)}
              >
                <MoreVert />
              </IconButton>
            </ListItemButton>
            <Collapse in={open[spacing.id]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {spacing.lists.map((list) => (
                  <ListItemButton
                    key={list.id}
                    component={Link}
                    to={`/spacings/${spacing.id}/lists/${list.id}`}
                    sx={{ pl: 4 }}
                  >
                    <ListIcon />
                    <ListItemText sx={{ pl: 1 }} primary={list.name_list} />
                    {isResposible && (
                      <IconButton
                        edge="end"
                        onClick={(e) => handleDeleteList(e, list.id)}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </div>
        ))}
      </div>
    );
  };

  if (redirect) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box>
      <List>
        <ListItemButton component={Link} to="/">
          <Home />
          <ListItemText sx={{ pl: 1 }} primary="Inicio" />
        </ListItemButton>
        <ListItemButton onClick={onCreateSpacing}>
          <CreateNewFolder />
          <ListItemText sx={{ pl: 1 }} primary="Crear Espacio" />
        </ListItemButton>
        {renderSpacings(spacings)}
      </List>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleAddClick}>
          <Add />
          Agregar Lista
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <Delete />
          Eliminar Espacio
        </MenuItem>
      </Menu>
      {deleteListId && (
        <ConfirmDelete
          table="table_lists"
          idForDelete={deleteListId}
          url="/"
          onRedirect={() => setRedirect(true)}
        />
      )}
    </Box>
  );
};

ListSideBar.propTypes = {
  spacings: PropTypes.array.isRequired,
  onCreateSpacing: PropTypes.func.isRequired,
  onCreateList: PropTypes.func.isRequired,
  onDeleteSpacing: PropTypes.func.isRequired,
};

export default ListSideBar;
