import { useContext } from "react";
import UserContext from "./hooks/use-users-context";

const useUser = () => {
  return useContext(UserContext);
};

export default useUser;
