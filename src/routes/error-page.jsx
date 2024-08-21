import { Typography, Button, Container } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PropTypes from "prop-types";

export default function ErrorPage({ error }) {
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
      {/* <Typography variant="h6" component="div" gutterBottom>
        Oops, the page you were looking for could not be found.
      </Typography> */}
      {error && (
        <Typography variant="h6" gutterBottom>
          {error.statusText || error.message}
        </Typography>
      )}
      <Button
        variant="outlined"
        color="error"
        startIcon={<HomeIcon />}
        href="/"
        sx={{ mt: 2 }}
      >
        Ir a la página principal
      </Button>
    </Container>
  );
}

ErrorPage.propTypes = {
  error: PropTypes.shape({
    statusText: PropTypes.string,
    message: PropTypes.string,
  }),
};
