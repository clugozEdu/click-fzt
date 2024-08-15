import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import App from "../App";
import Login from "../auth/Login";
import SignUp from "../auth/Signup";
import RequireAuth from "../auth/RequiredAuth";
import TaskPage from "../tasks/Task";
import SpacingPage from "../tasks/Spacing";

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
