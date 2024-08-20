import { Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import TableComponent from "../spacing-components/table-component";

const TableTask = ({ tasks, users }) => {
  const getUsersByIds = (userIds) => {
    if (!userIds || userIds.length === 0) return [];
    return users.filter((user) => userIds.includes(user.id));
  };

  const columns = [
    { id: "name_task", label: "Nombre" },
    { id: "start_date", label: "Inicio", align: "right" },
    { id: "end_date", label: "Fin", align: "right" },
    { id: "time_task", label: "Tiempo", align: "right" },
    { id: "status", label: "Estado", align: "right" },
    { id: "responsable", label: "Responsable", align: "right" },
  ];

  const transformRow = (task) => {
    const responsibleUsers = getUsersByIds(task.user_id);

    return {
      id: task.id,
      name_task: task.name_task,
      start_date: task.start_date,
      end_date: task.end_date,
      time_task: task.time_task,
      status: task.status.status_name,
      responsable: responsibleUsers.map((user) => (
        <Tooltip
          key={user.id}
          title={`${user.first_name} ${user.second_name} ${user.last_name} ${user.second_lastname}`}
        >
          <span>
            {user.first_name} {user.last_name}
          </span>
        </Tooltip>
      )),
    };
  };

  return (
    <TableComponent
      columns={columns}
      rows={tasks.map(transformRow)}
      keys={columns.map((column) => column.id)}
    />
  );
};

TableTask.propTypes = {
  tasks: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
};

export default TableTask;
