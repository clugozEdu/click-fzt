import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Divider } from "@mui/material";
import useUser from "../../context/users";
import { fetchSpacingAll, fetchSupabaseDB } from "../../supabaseServices";
import SpacingDashboard from "../components/spacing-dashboard";
import useLoading from "../../context/loading";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import HeaderMenu from "../../layout/components/header-menu";

const SpacingPage = () => {
  const { setIsLoading } = useLoading();
  const { spacingId } = useParams();
  const { advisorLogin } = useUser();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterTask, setFilterTask] = useState([]);
  const [stateParent] = useAutoAnimate(); // Hook para animar el contenedor principal de los estados
  const [currentView, setCurrentView] = useState("dashboard");

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

      setIsLoading(false);
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
    <div ref={stateParent}>
      <HeaderMenu onViewChange={setCurrentView} />

      <Divider sx={{ mb: 2 }} />

      {filterTask.length > 0 &&
        filterTask.map(
          (item, index) =>
            currentView === "dashboard" && (
              <SpacingDashboard
                key={index}
                tasks={item.lists.flatMap((task) => task.tasks)}
                lists={item.lists}
                users={users}
                nameSpacing={item.name_spacing}
              />
            )
        )}
    </div>
  );
};

export default SpacingPage;
