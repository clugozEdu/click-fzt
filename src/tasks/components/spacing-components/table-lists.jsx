import {
  Tooltip,
  Avatar,
  AvatarGroup,
  LinearProgress,
  Box,
} from "@mui/material";
import PropTypes from "prop-types";
import { useParams, Link } from "react-router-dom";
import { stringAvatar } from "../../../utils/utilities";
import TableComponent from "./table-component";

const TableDetails = ({ lists, users }) => {
  const { spacingId } = useParams(); // Destructuración directa del objeto devuelto por useParams

  const getUsersByIds = (userIds) => {
    if (!userIds || userIds.length === 0) return [];
    return users.filter((user) => userIds.includes(user.id));
  };

  const columns = [
    { id: "name_list", label: "Lista" },
    { id: "progress", label: "Progreso", align: "left" },
    { id: "totalTasks", label: "Total Tareas", align: "right" },
    { id: "backlog", label: "Backlog", align: "right" },
    { id: "inProgress", label: "En Progreso", align: "right" },
    { id: "done", label: "Realizado", align: "right" },
    { id: "responsables", label: "Responsables", align: "center" },
  ];

  const transformRow = (list) => {
    const filteredUsers = getUsersByIds(list.users_id);
    const listTasks = list.tasks.length;
    const listBacklog = list.tasks.filter(
      (task) => task.status.status_name === "Backlog"
    ).length;
    const listInProgress = list.tasks.filter(
      (task) => task.status.status_name === "En Progreso"
    ).length;
    const listDone = list.tasks.filter(
      (task) => task.status.status_name === "Realizado"
    ).length;
    const progress = listTasks
      ? ((listDone / listTasks) * 100).toFixed(2)
      : "0.00";
    const progressValue = parseFloat(progress);

    return {
      id: list.id,
      name_list: (
        <Link
          to={`/spacings/${spacingId}/lists/${list.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {list.name_list}
        </Link>
      ),
      progress: (
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" value={progressValue} />
          {progress}%
        </Box>
      ),
      totalTasks: listTasks,
      backlog: listBacklog,
      inProgress: listInProgress,
      done: listDone,
      responsables: (
        <AvatarGroup max={3}>
          {filteredUsers.map((user) => (
            <Tooltip
              key={user.id}
              title={`${user.first_name} ${user.second_name} ${user.last_name} ${user.second_lastname}`}
            >
              <Avatar
                {...stringAvatar(`${user.first_name} ${user.last_name}`)}
              />
            </Tooltip>
          ))}
        </AvatarGroup>
      ),
    };
  };

  return (
    <TableComponent
      columns={columns}
      rows={lists.map(transformRow)}
      keys={columns.map((column) => column.id)}
    />
  );
};

TableDetails.propTypes = {
  lists: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
};

export default TableDetails;
