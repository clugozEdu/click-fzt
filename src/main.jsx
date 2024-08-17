import { createRoot } from "react-dom/client";
import "./index.css";
import router from "./routes/Routes";
import { RouterProvider } from "react-router-dom";
import { UserProvider } from "./context/hooks/use-users-context";
import { LoadingProvider } from "./context/hooks/use-loading-context";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <LoadingProvider>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </LoadingProvider>
);
