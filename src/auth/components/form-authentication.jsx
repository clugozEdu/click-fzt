import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Paper,
  Grid,
  CssBaseline,
  Typography,
  Link,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SnackbarCustom from "../../layout/components/snackbar";
import supabase from "../../supabaseClient";
import { handlerInsertSupabase, fetchSupabaseDB } from "../../supabaseServices";
import bcrypt from "bcryptjs";
import PropTypes from "prop-types";

const AuthForm = ({ type }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [lastName, setLastName] = useState("");
  const [secondLastname, setSecondLastname] = useState("");
  const [country, setCountry] = useState([]);
  const [countrySelect, setCountrySelect] = useState(0);
  const [area, setArea] = useState([]);
  const [areaSelect, setAreaSelect] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (type === "register") {
      const handleFetch = async () => {
        const countryFeth = fetchSupabaseDB("table_country_users", "*");
        const areaFetch = fetchSupabaseDB("table_areas_users", "*");

        const [countryRegister, areaRegister] = await Promise.all([
          countryFeth,
          areaFetch,
        ]);

        setCountry(countryRegister.data);
        setArea(areaRegister.data);
      };
      handleFetch();
    }
  }, [type]);

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    if (type === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(
          error.status === 400
            ? "Credenciales incorrectas. Inténtelo de nuevo."
            : error.message
        );
        setShowAlert(true);
      } else {
        navigate("/");
      }
    } else if (type === "register") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            fullname: `${firstName} ${lastName}`,
            first_name: firstName,
            second_name: secondName,
            last_name: lastName,
            second_surname: secondLastname,
            area_name: area,
            role_name: "user",
          },
        },
      });
      if (error) {
        setError(error.message);
        setShowAlert(true);
      } else {
        await handleCreateUser(data.user);
        navigate("/");
      }
    }
    setLoading(false);
  };

  const handleCreateUser = async (userLogin) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const dataInsert = {
      id: userLogin.id,
      area_id: areaSelect,
      role_id: 2, // user default
      country_id: countrySelect,
      email: email,
      is_active: true,
      first_name: firstName,
      second_name: secondName,
      last_name: lastName,
      second_lastname: secondLastname,
      password: hashedPassword,
    };

    const result = await handlerInsertSupabase("table_users", dataInsert);

    if (result) {
      ("Usuario guardado con exito en la table_advisor");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        borderRadius: "20px",
      }}
    >
      <Grid
        container
        component={Paper}
        elevation={6}
        sx={{
          width: { xs: "80%", sm: "60%", md: "40%", lg: "30%" },
          padding: 4,
          borderRadius: 5,
          boxShadow: 3,
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CssBaseline />
        <img
          src="/public/assets/logo.png"
          alt="Logo"
          style={{ height: "100px" }}
        />
        <Typography component="h1" variant="h5" sx={{ marginTop: 2 }}>
          {type === "login" ? "Inicio de Sesión" : "Crear una cuenta"}
        </Typography>
        {showAlert && (
          <SnackbarCustom
            open={showAlert}
            message={error}
            title={
              type === "login"
                ? "Error al iniciar sesión:"
                : "Error al crear usuario:"
            }
            onCloseHandler={() => setShowAlert(false)}
            duration={3000}
            severity="error"
            vertical="top"
            horizontal="center"
          />
        )}
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 1, width: "100%" }}
        >
          {type === "register" && (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    id="first-name"
                    label="Primer Nombre"
                    name="first-name"
                    autoFocus
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    InputProps={{
                      style: { borderRadius: "20px" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="second-name"
                    label="Segundo Nombre"
                    name="second-name"
                    value={secondName}
                    onChange={(e) => setSecondName(e.target.value)}
                    InputProps={{
                      style: { borderRadius: "20px" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    id="last-name"
                    label="Primer Apellido"
                    name="last-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    InputProps={{
                      style: { borderRadius: "20px" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="second-lastname"
                    label="Segundo Apellido"
                    name="second-lastname"
                    value={secondLastname}
                    onChange={(e) => setSecondLastname(e.target.value)}
                    InputProps={{
                      style: { borderRadius: "20px" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="País"
                    select
                    id="country"
                    value={countrySelect}
                    onChange={(e) => setCountrySelect(e.target.value)}
                    InputProps={{
                      style: { borderRadius: "20px" },
                    }}
                  >
                    {country.length > 0 ? (
                      country.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.country_name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem>Cargando...</MenuItem>
                    )}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Área FZT"
                    select
                    id="area-fzt"
                    value={areaSelect}
                    onChange={(e) => setAreaSelect(e.target.value)}
                    InputProps={{
                      style: { borderRadius: "20px" },
                    }}
                  >
                    {area.length > 0 ? (
                      area.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.area_name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem>Cargando...</MenuItem>
                    )}
                  </TextField>
                </Grid>
              </Grid>
            </>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              style: { borderRadius: "20px" },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              style: { borderRadius: "20px" },
            }}
          />
          <Box sx={{ position: "relative" }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, borderRadius: "20px" }}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={24} /> : null}
            >
              {loading
                ? type === "login"
                  ? "Accediendo..."
                  : "Creando..."
                : type === "login"
                ? "Iniciar Sesión"
                : "Crear Cuenta"}
            </Button>

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 1, borderRadius: "20px" }}
              disabled={loading}
            >
              <Typography variant="body2" align="center">
                <Link
                  color="inherit"
                  href={type === "login" ? "/sign_up" : "/login"}
                >
                  {type === "login"
                    ? "Crear una cuenta"
                    : "¿Usuario creado? Iniciar Sesión"}
                </Link>
              </Typography>
            </Button>
          </Box>
        </Box>
        <Copyright marginTop={2} />
      </Grid>
    </Box>
  );
};

AuthForm.propTypes = {
  type: PropTypes.oneOf(["login", "register"]).isRequired,
};

const Copyright = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://fundacionzt.org/">
        Fundación Zamora Teran
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default AuthForm;
