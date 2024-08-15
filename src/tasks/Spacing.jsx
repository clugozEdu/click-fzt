import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useUser from "../context/UseUser";
import { fetchSpacingAll, fetchSupabaseDB } from "../supabaseServices";
import TaskList from "./components/TaskList";
import { Skeleton } from "@mui/material";

const SpacingPage = () => {
  const { spacingId } = useParams();
  const { advisorLogin } = useUser();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterTask, setFilterTask] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const taskPromise = fetchSpacingAll(advisorLogin.sub);
      const usersPromise = fetchSupabaseDB("table_users", "");
      const [taskResult, usersResult] = await Promise.all([
        taskPromise,
        usersPromise,
      ]);
      setTasks(taskResult.data || []);
      setUsers(usersResult.data || []);
    }

    if (advisorLogin.sub) {
      fetchData();
    }
  }, [advisorLogin.sub, spacingId]);

  useEffect(() => {
    if (tasks.length > 0) {
      setFilterTask(tasks.filter((task) => task.id == spacingId));
    }
  }, [tasks, spacingId]);

  return (
    <div>
      {filterTask.length > 0 ? (
        filterTask.map((item, index) => (
          <TaskList key={index} lists={item.lists} users={users} />
        ))
      ) : (
        <Skeleton />
      )}
    </div>
  );
};

export default SpacingPage;
