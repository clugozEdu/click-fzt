import { useContext } from "react";
import LoadingContext from "./hooks/use-loading-context";

const useLoading = () => {
  return useContext(LoadingContext);
};

export default useLoading;
