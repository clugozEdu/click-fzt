import { useCallback, useEffect, useState } from "react";
import { CssBaseline } from "@mui/material";
import AppBarSite from "./layout/components/app-bar";
import { fetchSpacingAll } from "./supabaseServices";
import useUser from "./context/users";
import useLoading from "./context/loading";
import useSupabaseSubscriptions from "./hooks/use-supabase-subscriptions";

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

  const loadSpacings = useCallback(async () => {
    setIsLoading(true);
    if (!storedAdvisor?.sub) return;
    const { data } = await fetchSpacingAll(storedAdvisor.sub);
    setSpacingUser(data);
    setIsLoading(false);
  }, [storedAdvisor, setIsLoading]);

  // Función para manerjar los eventos de la base de datos
  const handleEvent = useCallback(
    (tableName, payload) => {
      console.log(`Received an event on ${tableName}:`, payload);
      loadSpacings();
    },
    [loadSpacings]
  );

  // Configuración de las suscripciones a cambios en la base de datos
  useSupabaseSubscriptions(
    [{ tableName: "table_lists" }, { tableName: "table_spacing" }],
    handleEvent
  );

  // Cargar los datos inciales cuando el asesor cambie
  useEffect(() => {
    if (storedAdvisor && storedAdvisor.sub) {
      loadSpacings();
    }
  }, [storedAdvisor, loadSpacings]);

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
