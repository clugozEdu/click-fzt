import { useEffect, useRef } from "react";
import supabase from "../supabaseClient";

const useSupabaseSubscriptions = (tables, handleEvent) => {
  const subscriptionsRef = useRef([]);

  useEffect(() => {
    if (!tables || tables.length === 0) return;

    // Solo configurar suscripciones si no están ya configuradas
    if (subscriptionsRef.current.length === 0) {
      const subscriptions = tables.map(({ tableName, eventFilter }) =>
        supabase
          .channel(`schema-db-changes-${tableName}`)
          .on(
            "postgres_changes",
            { event: eventFilter || "*", schema: "public", table: tableName },
            (payload) => {
              console.log(`Received an event on ${tableName}:`, payload);
              handleEvent(tableName, payload);
            }
          )
          .subscribe()
      );

      subscriptionsRef.current = subscriptions;
    }

    // Cleanup de las suscripciones al desmontar el componente o cambiar las tablas
    return () => {
      subscriptionsRef.current.forEach((subscription) => {
        supabase.removeChannel(subscription);
      });
      subscriptionsRef.current = [];
    };
  }, [tables, handleEvent]);
};

export default useSupabaseSubscriptions;
