import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  IconButton,
  Tooltip,
  Avatar,
  Chip,
} from "@mui/material";
import PropTypes from "prop-types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import EventBusyIcon from "@mui/icons-material/EventBusy"; // Importar el icono
import {
  statusColors,
  getColorsScheme,
  stringAvatar,
} from "../../../utils/utilities";
import DateMenuCard from "../../components/tasks-components/date-menu";
import TimeMenu from "../../components/tasks-components/time-menu";
import PriorityChip from "../../components/tasks-components/priority-chip";
import DescriptionMenuCard from "../../components/tasks-components/description-menu";
import TableComponent from "../../components/spacing-components/table-component";
import MenuCards from "../../components/tasks-components/menu-cards";

const ListTask = ({ groupedTasks, statusTask, handleAddTask }) => {
  const [expanded, setExpanded] = useState(
    statusTask.reduce((acc, status) => {
      acc[status.id] = true;
      return acc;
    }, {})
  );

  const handleAccordionChange = (statusId) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [statusId]: !prevExpanded[statusId],
    }));
  };

  const handleAddButtonClick = (e, statusId) => {
    e.stopPropagation();
    handleAddTask(statusId);
  };

  const columns = [
    { id: "name_task", label: "Nombre" },
    { id: "description_task", label: "Descripción" },
    { id: "start_date", label: "Inicio", align: "right" },
    { id: "end_date", label: "Fin", align: "right" },
    { id: "time_task", label: "Tiempo", align: "right" },
    { id: "status", label: "Estado", align: "right" },
    { id: "responsable", label: "Responsable", align: "right" },
    { id: "actions", label: "Mover", align: "right" },
  ];

  const transformRow = (task) => {
    const userName = `${task.user.first_name} ${task.user.last_name}`;
    return {
      id: task.id,
      description_task: (
        <DescriptionMenuCard
          description={task.description_task}
          taskID={task.id}
        />
      ),
      name_task: task.name_task,
      start_date: (
        <DateMenuCard
          date={task.start_date}
          // text={"Inicio: "}
          taskID={task.id}
          keyUpdate={"start_date"}
        />
      ),
      end_date: (
        <DateMenuCard
          date={task.end_date}
          // text={"Fin: "}
          taskID={task.id}
          keyUpdate={"end_date"}
        />
      ),
      time_task: <TimeMenu task={task} />,
      status: (
        <Box display="flex" alignItems="center">
          <PriorityChip priority={task.priority} idTask={task.id} />
          {task.overdue && (
            <Chip
              label="Atrasada"
              icon={
                <EventBusyIcon
                  sx={{
                    fill: "white",
                  }}
                />
              }
              sx={{
                backgroundColor: "#FF3D3D",
                color: "white",
                ml: 1,
              }}
            />
          )}
        </Box>
      ),
      responsable: (
        <Tooltip title={userName}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              marginRight: 1,
            }}
            {...stringAvatar(userName)}
          />
        </Tooltip>
      ),
      actions: <MenuCards idStatus={task.status.id} taskId={task.id} />,
    };
  };

  return (
    <>
      {statusTask.map((status) => (
        <Accordion
          sx={{
            boxShadow: 3,
          }}
          key={status.id}
          expanded={expanded[status.id]}
          onChange={() => handleAccordionChange(status.id)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box display="flex" alignItems="center">
              <Chip
                label={status.status_name}
                sx={{
                  backgroundColor: getColorsScheme(
                    status.status_name,
                    statusColors
                  ),
                  color: "white",
                }}
              />
              <IconButton
                aria-hidden="true"
                sx={{
                  ml: 1,
                }}
                onClick={(e) => handleAddButtonClick(e, status.id)}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <TableComponent
              columns={columns}
              rows={groupedTasks[status.status_name]?.map(transformRow) || []}
              keys={columns.map((column) => column.id)}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

ListTask.propTypes = {
  groupedTasks: PropTypes.object.isRequired,
  statusTask: PropTypes.array,
  handleAddTask: PropTypes.func.isRequired,
};

export default ListTask;
