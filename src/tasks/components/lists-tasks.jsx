import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Box,
  Avatar,
  AvatarGroup,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PropTypes from "prop-types";
import { stringAvatar } from "../../utils/utilities";
import { useParams, Link } from "react-router-dom";

const TaskList = ({ lists, users }) => {
  const { spacingId } = useParams(); // Destructuración directa del objeto devuelto por useParams
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const getUsersByIds = (userIds) => {
    if (!userIds || userIds.length === 0) return [];
    return users.filter((user) => userIds.includes(user.id));
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Resumen del Espacio
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Lista</TableCell>
                {isMobile ? null : (
                  <>
                    <TableCell align="left">Progreso</TableCell>
                    <TableCell align="right">Total Tareas</TableCell>
                    <TableCell align="right">Backlog</TableCell>
                    <TableCell align="right">En Progreso</TableCell>
                    <TableCell align="right">Realizado</TableCell>
                  </>
                )}
                <TableCell align="center">Responsables</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lists.map((list) => {
                const filteredUsers = getUsersByIds(list.users_id);
                const totalTasks = list.tasks.length;
                const tasksDone = list.tasks.filter(
                  (task) => task.status.status_name === "Realizado"
                ).length;
                // Calcular el progreso y formatear a dos decimales
                const progress = totalTasks
                  ? ((tasksDone / totalTasks) * 100).toFixed(2)
                  : "0.00";
                const progressValue = parseFloat(progress);

                return (
                  <TableRow
                    key={list.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Link
                        to={`/spacings/${spacingId}/lists/${list.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {list.name_list}
                      </Link>
                    </TableCell>
                    {isMobile ? (
                      <TableCell align="right">
                        <LinearProgress
                          variant="determinate"
                          value={progressValue}
                        />
                        {progress}%
                      </TableCell>
                    ) : (
                      <>
                        <TableCell align="right">
                          <Box sx={{ width: "100%", mr: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={progressValue}
                            />
                            {progress}%
                          </Box>
                        </TableCell>
                        <TableCell align="right">{totalTasks}</TableCell>
                        <TableCell align="right">
                          {
                            list.tasks.filter(
                              (task) => task.status.status_name === "Backlog"
                            ).length
                          }
                        </TableCell>
                        <TableCell align="right">
                          {
                            list.tasks.filter(
                              (task) =>
                                task.status.status_name === "En Progreso"
                            ).length
                          }
                        </TableCell>
                        <TableCell align="right">{tasksDone}</TableCell>
                      </>
                    )}
                    <TableCell align="center">
                      <AvatarGroup max={4}>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <Tooltip
                              key={user.id}
                              title={`${user.first_name} ${user.second_name} ${user.last_name} ${user.second_lastname}`}
                            >
                              <Avatar
                                {...stringAvatar(
                                  `${user.first_name} ${user.last_name}`
                                )}
                              />
                            </Tooltip>
                          ))
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            No hay usuarios asignados
                          </Typography>
                        )}
                      </AvatarGroup>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

TaskList.propTypes = {
  lists: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
};

export default TaskList;
