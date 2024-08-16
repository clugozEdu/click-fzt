import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useUser from "../../context/users";
import { fetchSpacingAll, fetchSupabaseDB } from "../../supabaseServices";
import TaskList from "../components/lists-tasks";
import useLoading from "../../context/loading";

const SpacingPage = () => {
  const { setIsLoading } = useLoading();
  const { spacingId } = useParams();
  const { advisorLogin } = useUser();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterTask, setFilterTask] = useState([]);

  useEffect(() => {
    setIsLoading(true);
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
  }, [advisorLogin.sub, spacingId, setIsLoading]);

  useEffect(() => {
    if (tasks.length > 0) {
      setIsLoading(true);
      setFilterTask(tasks.filter((task) => task.id == spacingId));
      setIsLoading(false);
    }
  }, [tasks, spacingId, setIsLoading]);

  return (
    <div>
      {filterTask.length > 0 &&
        filterTask.map((item, index) => (
          <TaskList key={index} lists={item.lists} users={users} />
        ))}
    </div>
  );
};

export default SpacingPage;
