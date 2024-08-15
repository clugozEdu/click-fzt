import { useRouteError } from "react-router-dom";
import { Typography, Button, Container } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h1" component="div" gutterBottom>
        404
      </Typography>
      <Typography variant="h6" component="div" gutterBottom>
        Oops, the page you were looking for could not be found.
      </Typography>
      <Button
        variant="outlined"
        color="error"
        startIcon={<HomeIcon />}
        href="/"
        sx={{ mt: 2 }}
      >
        Go to Homepage
      </Button>
    </Container>
  );
}
