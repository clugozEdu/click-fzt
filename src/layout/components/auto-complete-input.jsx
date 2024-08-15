import { useState } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  TextField,
  Autocomplete,
  CircularProgress,
  Chip,
} from "@mui/material";

const AutoCompleteFormField = ({
  label,
  options,
  getOptionLabel,
  getOptionSelectedValue,
  getOptionDisabled,
  xs = 12,
  sm = 12,
  md = 6,
  lg = 3,
  limitTags = 2,
  maxSelections,
  onDeleteTag,
  ...props
}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputError, setInputError] = useState("");
  const loading = options.length === 0;

  const handleChange = (event, newValue) => {
    if (!maxSelections || newValue.length <= maxSelections) {
      setSelectedOptions(newValue);
    } else {
      setInputError(`Maximum of ${maxSelections} selections are allowed.`);
    }
  };

  const handleDelete = (optionToDelete) => {
    const newValue = selectedOptions.filter(
      (option) =>
        getOptionSelectedValue(option) !==
        getOptionSelectedValue(optionToDelete)
    );
    setSelectedOptions(newValue);
    if (onDeleteTag) onDeleteTag(optionToDelete);
  };

  return (
    <Grid item xs={xs} sm={sm} md={md} lg={lg}>
      <Autocomplete
        multiple
        limitTags={limitTags}
        {...props}
        options={options}
        getOptionLabel={getOptionLabel}
        getOptionDisabled={getOptionDisabled}
        value={selectedOptions}
        onChange={handleChange}
        disableCloseOnSelect
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => {
            const { onDelete, ...tagProps } = getTagProps({ index });
            const isDisabled = getOptionDisabled
              ? getOptionDisabled(option)
              : false;
            return (
              <Chip
                key={index}
                label={getOptionLabel(option)}
                disabled={isDisabled}
                onDelete={isDisabled ? undefined : () => handleDelete(option)}
                {...tagProps}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={Boolean(inputError)}
            helperText={inputError}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </Grid>
  );
};

AutoCompleteFormField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  getOptionLabel: PropTypes.func.isRequired,
  getOptionSelectedValue: PropTypes.func.isRequired,
  getOptionDisabled: PropTypes.func,
  xs: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  lg: PropTypes.number,
  limitTags: PropTypes.number,
  maxSelections: PropTypes.number,
  onDeleteTag: PropTypes.func,
};

export default AutoCompleteFormField;
