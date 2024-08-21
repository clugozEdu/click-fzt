import { Card, CardContent, Typography, Grid } from "@mui/material";
import PropTypes from "prop-types";
import TableDetails from "./spacing-components/table-lists";
import TableUser from "./spacing-components/user-details";
import TableTask from "./spacing-components/table-tasks";

const SpacingDashboard = ({ lists, users, tasks }) => {
  const noData =
    !lists ||
    lists.length === 0 ||
    !users ||
    users.length === 0 ||
    !tasks ||
    tasks.length === 0;

  return (
    <Grid container spacing={2}>
      {/* <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Espacio: <strong>{nameSpacing}</strong>
        </Typography>
      </Grid> */}
      {noData ? (
        <Grid item xs={12}>
          <Typography variant="h6" align="center" gutterBottom>
            No hay datos disponibles
          </Typography>
        </Grid>
      ) : (
        <>
          <Grid item xs={12} sm={12} md={12} lg={5}>
            {/* Card with user details */}
            <Card sx={{ marginBottom: 2, boxShadow: 5, borderRadius: 5 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Detalle por usuario
                </Typography>
                {/* Table with user details */}
                <TableUser users={users} lists={lists} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={7}>
            {/* Card with tasks */}
            <Card sx={{ marginBottom: 2, boxShadow: 5, borderRadius: 5 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tareas del espacio
                </Typography>
                {/* Table with tasks */}
                <TableTask tasks={tasks} users={users} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            {/* Card with lists */}
            <Card sx={{ marginBottom: 2, boxShadow: 5, borderRadius: 5 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Listas
                </Typography>
                {/* Table with lists */}
                <TableDetails lists={lists} users={users} />
              </CardContent>
            </Card>
          </Grid>
        </>
      )}
    </Grid>
  );
};

SpacingDashboard.propTypes = {
  lists: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  // nameSpacing: PropTypes.string.isRequired,
  tasks: PropTypes.array.isRequired,
};

export default SpacingDashboard;
