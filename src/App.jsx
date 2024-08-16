import { useEffect, useState } from "react";
import { CssBaseline } from "@mui/material";
import AppBarSite from "./layout/components/app-bar";
import { fetchSpacingAll } from "./supabaseServices";
import useUser from "./context/users";
import supabase from "./supabaseClient"; // Asegúrate de que la ruta de importación es correcta
import useLoading from "./context/loading";

function App() {
  const { advisorLogin } = useUser();
  const [spacingUser, setSpacingUser] = useState([]);
  const { isLoading, setIsLoading } = useLoading();
  const [storedAdvisor, setStoredAdvisor] = useState(null);

  useEffect(() => {
    // Si advisorLogin ha cambiado, actualizamos el estado y hacemos el fetch
    if (advisorLogin && advisorLogin.sub !== storedAdvisor?.sub) {
      setStoredAdvisor(advisorLogin);
    }
  }, [advisorLogin, storedAdvisor]);

  useEffect(() => {
    const loadSpacings = async () => {
      setIsLoading(true);
      const { data } = await fetchSpacingAll(storedAdvisor.sub);
      setSpacingUser(data);
      setIsLoading(false);
    };

    // Cargar los datos solo si storedAdvisor está definido
    if (storedAdvisor && storedAdvisor.sub) {
      loadSpacings();
    }

    // Configuración de la suscripción a cambios de la base de datos
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "table_lists" },
        (payload) => {
          console.log("Received an insert:", payload);
          loadSpacings();
        }
      )
      .subscribe();

    // Limpieza de la suscripción
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [storedAdvisor, setIsLoading]);

  return (
    <>
      <CssBaseline />
      {advisorLogin && (
        <AppBarSite
          advisor={advisorLogin}
          spacings={spacingUser}
          loading={isLoading}
        />
      )}
    </>
  );
}

export default App;
