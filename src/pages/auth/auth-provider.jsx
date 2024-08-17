import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import PropTypes from "prop-types";

function RequireAuth({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener la sesión actual al montar el componente
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []); // Sin dependencias se ejecuta al montar y desmontar

  // Verificar si el token ha expirado
  const isTokenExpired = (session) => {
    if (!session) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = session.expires_at < currentTime;

    if (isExpired) {
      localStorage.removeItem("sb-iemhpugvjgaazoifqjpj-auth-token"); // Eliminar la sesión del localStorage si ha expirado
    }

    return isExpired;
  };

  // const timeUntilExpiration = (session) => {
  //   if (!session) return "Session not provided";

  //   const currentTime = Math.floor(Date.now() / 1000);
  //   const expiresAt = session.expires_at;

  //   if (expiresAt < currentTime) return "Token already expired";

  //   const remainingTimeInSeconds = expiresAt - currentTime;

  //   const hours = Math.floor(remainingTimeInSeconds / 3600);
  //   const minutes = Math.floor((remainingTimeInSeconds % 3600) / 60);
  //   const seconds = remainingTimeInSeconds % 60;

  //   return `${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
  // };

  // console.log(timeUntilExpiration(session));

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session || isTokenExpired(session)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RequireAuth;
