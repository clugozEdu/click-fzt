import PropTypes from "prop-types";
import FormCreate from "../forms/components/form-create";

const CreateSpacingForm = ({ setOpenDialog }) => {
  const objectPost = {
    name_spacing: "",
    description_spacing: "",
    user_responsible_id: "",
    users_id: [],
    is_active: true,
  };

  const nameInputs = {
    nameLabel: "Nombre del Espacio",
    descriptionLabel: "Descripción",
  };

  return (
    <FormCreate
      title={"Crear espacio nuevo"}
      keyName={"name_spacing"}
      keyDescription={"description_spacing"}
      nameInputs={nameInputs}
      objectPost={objectPost}
      setOpenDialog={setOpenDialog}
      nameTablePost={"table_spacing"}
    />
  );
};

CreateSpacingForm.propTypes = {
  onSubmit: PropTypes.func,
  setOpenDialog: PropTypes.func,
};

export default CreateSpacingForm;
