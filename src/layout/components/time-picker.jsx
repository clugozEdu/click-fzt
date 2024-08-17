import PropTypes from "prop-types";
import { TextField, MenuItem } from "@mui/material";
import { timeOptions } from "../../utils/utilities";

const ControlledTimePicker = ({ label, value, onChange, name }) => {
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
