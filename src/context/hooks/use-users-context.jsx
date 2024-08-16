import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import supabase from "../../supabaseClient";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [advisorLogin, setAdvisorLogin] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setAdvisorLogin(session?.user?.user_metadata || null);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || event === "USER_DELETED") {
          setAdvisorLogin(null);
        } else if (event === "SIGNED_IN") {
          setAdvisorLogin(session?.user?.user_metadata || null);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ advisorLogin }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserContext;
