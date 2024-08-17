import { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import useUser from "../../context/users";
import PropTypes from "prop-types";
import { fetchSupabaseDB, handlerInsertSupabase } from "../../supabaseServices";

const FormCreate = ({
  setOpenDialog,
  nameTablePost,
  objectPost,
  nameInputs,
  keyName,
  keyDescription,
  title,
}) => {
  const { advisorLogin } = useUser();
  const [users, setUsers] = useState([]);
  const [dataPost, setDataPost] = useState({
    ...objectPost,
    user_responsible_id: advisorLogin.sub,
    users_id: [advisorLogin.sub],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await fetchSupabaseDB("table_users", "*");
      setUsers(data);
    };
    fetchUsers();
  }, [advisorLogin.sub]);

  const handleChange = (event, value) => {
    const advisorUser = users.find((user) => user.id === advisorLogin.sub) || {
      id: advisorLogin.sub,
      first_name: advisorLogin.first_name || "",
      second_name: advisorLogin.second_name || "",
      last_name: advisorLogin.last_name || "",
      second_lastname: advisorLogin.second_lastname || "",
    };

    const newValue = value.some((user) => user.id === advisorLogin.sub)
      ? value
      : [...value, advisorUser];

    setDataPost({
      ...dataPost,
      users_id: newValue.map((user) => user.id),
    });
  };

  const handleInputChange = (event) => {
    setDataPost({
      ...dataPost,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = {};

    if (!dataPost[keyName]) {
      newErrors[keyName] = "El nombre del espacio no puede estar en blanco";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    handlerInsertSupabase(nameTablePost, dataPost);
    setOpenDialog(false);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label={nameInputs.nameLabel}
          variant="outlined"
          fullWidth
          margin="normal"
          name={keyName}
          value={dataPost[keyName]}
          onChange={handleInputChange}
          error={!!errors[keyName]}
          helperText={errors[keyName]}
          sx={{
            "& .MuiInputBase-root": {
              borderRadius: "20px",
            },
          }}
        />
        <TextField
          label={nameInputs.descriptionLabel}
          variant="outlined"
          fullWidth
          margin="normal"
          name={keyDescription}
          value={dataPost[keyDescription]}
          onChange={handleInputChange}
          sx={{
            "& .MuiInputBase-root": {
              borderRadius: "20px",
            },
            mb: 3,
          }}
        />
        <Autocomplete
          multiple
          options={users}
          getOptionLabel={(option) =>
            `${option.first_name} ${option.second_name} ${option.last_name} ${option.second_lastname}`
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Seleccione los Usuarios"
              placeholder="Usuarios"
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: "20px",
                },
              }}
            />
          )}
          value={users.filter((user) => dataPost.users_id.includes(user.id))}
          onChange={handleChange}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip
                  key={key}
                  label={`${option.first_name} ${option.last_name}`}
                  {...tagProps}
                />
              );
            })
          }
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 2,
            borderRadius: 5,
          }}
        >
          Crear Espacio
        </Button>
      </form>
    </Box>
  );
};

FormCreate.propTypes = {
  title: PropTypes.string.isRequired,
  setOpenDialog: PropTypes.func.isRequired,
  nameTablePost: PropTypes.string.isRequired,
  objectPost: PropTypes.object.isRequired,
  nameInputs: PropTypes.object.isRequired,
  keyName: PropTypes.string.isRequired,
  keyDescription: PropTypes.string.isRequired,
};

export default FormCreate;
