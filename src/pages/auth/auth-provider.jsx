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

  const isTokenExpired = (session) => {
    if (!session) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = session.expires_at < currentTime;

    if (isExpired) {
      localStorage.removeItem("sb-iemhpugvjgaazoifqjpj-auth-token");
    }

    return isExpired;
  };

  if (loading) {
    return null;
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
