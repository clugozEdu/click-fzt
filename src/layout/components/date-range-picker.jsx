import PropTypes from "prop-types";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const ControlledDatePicker = ({ label, value, onChange, name }) => {
  const handleDateChange = (newValue) => {
    onChange({
      target: {
        name: name,
        value: newValue ? newValue.format("YYYY/MM/DD") : "",
      },
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value ? dayjs(value, "YYYY/MM/DD") : null}
        onChange={handleDateChange}
        sx={{
          "& .MuiInputBase-root": {
            borderRadius: "20px",
          },
        }}
      />
    </LocalizationProvider>
  );
};

ControlledDatePicker.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default ControlledDatePicker;
