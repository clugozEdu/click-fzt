import PropTypes from "prop-types";
import FormCreate from "../forms/components/form-create";

const CreateListForm = ({ idSpacing, setOpenDialog }) => {
  const objectPost = {
    name_list: "",
    description_list: "",
    user_responsible_id: "",
    spacing_id: idSpacing,
    users_id: [],
    is_active: true,
  };

  const nameInputs = {
    nameLabel: "Nombre de la Lista",
    descriptionLabel: "Descripción",
  };

  return (
    <FormCreate
      title={"Crear lista nueva"}
      keyName={"name_list"}
      keyDescription={"description_list"}
      nameInputs={nameInputs}
      objectPost={objectPost}
      setOpenDialog={setOpenDialog}
      nameTablePost={"table_lists"}
    />
  );
};

CreateListForm.propTypes = {
  idSpacing: PropTypes.number.isRequired,
  setOpenDialog: PropTypes.func,
};

export default CreateListForm;
