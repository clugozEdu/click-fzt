import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
import {
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  CssBaseline,
  Box,
} from "@mui/material";
import PropTypes from "prop-types";
import MenuIcon from "@mui/icons-material/Menu";
import AccountMenu from "./account-menu";
import CreateSpacingForm from "../../tasks/forms/create-spacing";
import CreateListForm from "../../tasks/forms/create-lists";
import ConfirmDelete from "../../tasks/components/deleted-component"; // Import the ConfirmDelete component
import LinearIndeterminate from "./linear-progress";
import CreateDialog from "./create-dialog";
import ListSideBar from "./list-side-bar";

const AppBarSite = ({ advisor, spacings, loading }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [idSpacing, setIdSpacing] = useState(0);
  const [contextDialog, setContextDialog] = useState("");
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const barSize = useMediaQuery(theme.breakpoints.down("lg"));

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCreateSpacing = () => {
    setIsDialogOpen(true);
    setContextDialog("creatingSpacing");
  };

  const handleDeleteSpacing = (id) => {
    setContextDialog("");
    setIdSpacing(id);
    setIsDeleteConfirm(true);
  };

  const handleAddList = (id) => {
    setIsDialogOpen(true);
    setContextDialog("creatingList");
    setIdSpacing(id);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const { fullname = "Nombre desconocido" } = advisor || {};

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ backgroundColor: "#0d1f2d" }}>
          {isMobile && (
            <IconButton
              color="inherit"
              // aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <img
            src="/public/assets/logo.png"
            alt="Logo"
            style={{ height: "50px" }}
          />
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, marginLeft: 2 }}>
            PIAR Fundación Zamora Terán
          </Typography>
          <Typography variant="h6" noWrap sx={{ marginRight: 1 }}>
            {fullname}
          </Typography>
          <AccountMenu userName={fullname} />
        </Toolbar>
        {/* progress */}
        {loading && <LinearIndeterminate />}
      </AppBar>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: barSize ? 250 : 300,
          [`& .MuiDrawer-paper`]: {
            width: barSize ? 250 : 300,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />

        <ListSideBar
          spacings={spacings}
          onCreateSpacing={handleCreateSpacing}
          onDeleteSpacing={handleDeleteSpacing}
          onCreateList={handleAddList}
          // loading={loading}
        />
      </Drawer>

      {/* Dialog for creating space or list */}
      <CreateDialog open={isDialogOpen} onClose={handleCloseDialog}>
        {contextDialog === "creatingSpacing" ? (
          <CreateSpacingForm setOpenDialog={setIsDialogOpen} />
        ) : contextDialog === "creatingList" ? (
          <CreateListForm
            idSpacing={idSpacing}
            setOpenDialog={setIsDialogOpen}
          />
        ) : (
          ""
        )}
      </CreateDialog>

      {/* Dialog for deleting space */}
      {isDeleteConfirm && contextDialog === "" && (
        <ConfirmDelete
          table={"table_spacing"}
          idForDelete={idSpacing}
          url={"/"}
          onClose={setIsDeleteConfirm}
        />
      )}

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 6 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

AppBarSite.propTypes = {
  advisor: PropTypes.object.isRequired,
  spacings: PropTypes.array,
  loading: PropTypes.bool,
};

export default AppBarSite;
