import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./error-page";
import App from "../App";
import Login from "../pages/auth/components/login-page";
import SignUp from "../pages/auth/components/signup-page";
import RequireAuth from "../pages/auth/auth-provider";
import TaskPage from "../tasks/pages/task-page";
import SpacingPage from "../tasks/pages/spacing-page";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/sign_up",
    element: <SignUp />,
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <App />
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "spacings/:spacingId/",
        element: <SpacingPage />,
      },
      {
        path: "spacings/:spacingId/lists/:listId",
        element: <TaskPage />,
      },
    ],
  },
]);

export default router;
