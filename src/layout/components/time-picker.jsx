import PropTypes from "prop-types";
import { TextField, MenuItem } from "@mui/material";

const ControlledTimePicker = ({ label, value, onChange, name }) => {
  const timeOptions = [
    { label: "30 minutos", value: 0.5 },
    { label: "1 hora", value: 1 },
    { label: "1 hora 30 minutos", value: 1.5 },
    { label: "2 horas", value: 2 },
    { label: "2 horas 30 minutos", value: 2.5 },
    { label: "3 horas", value: 3 },
    { label: "3 horas 30 minutos", value: 3.5 },
    { label: "4 horas", value: 4 },
    { label: "4 horas 30 minutos", value: 4.5 },
    { label: "5 horas", value: 5 },
    { label: "5 horas 30 minutos", value: 5.5 },
    { label: "6 horas", value: 6 },
    { label: "6 horas 30 minutos", value: 6.5 },
    { label: "7 horas", value: 7 },
    { label: "7 horas 30 minutos", value: 7.5 },
    { label: "8 horas", value: 8 },
  ];

  const handleTimeChange = (event) => {
    onChange({
      target: {
        name: name,
        value: event.target.value,
      },
    });
  };

  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={handleTimeChange}
      fullWidth
      variant="outlined"
      sx={{
        "& .MuiInputBase-root": {
          borderRadius: "20px",
        },
      }}
    >
      {timeOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

ControlledTimePicker.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default ControlledTimePicker;
