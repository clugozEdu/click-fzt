import { useState } from "react";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { handlerUpdateBD } from "../../supabaseServices";
import "../../App.css";

const ConfirmDelete = ({ table, idForDelete, url }) => {
  const [redirect, setRedirect] = useState(false);

  const columnUpdate = {
    is_active: false,
  };

  const onDesactivate = async () => {
    await handlerUpdateBD(table, columnUpdate, idForDelete);
    Swal.fire(
      "¡Eliminado!",
      `El espacio "${idForDelete}" ha sido eliminado.`,
      "success"
    );
    setRedirect(true);
  };

  const handleConfirm = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `No podrás revertir esto. Se eliminará "${idForDelete}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        onDesactivate();
      }
    });
  };

  if (redirect) {
    return <Navigate to={url} replace />;
  }

  // Trigger the confirmation dialog when the component mounts
  handleConfirm();

  return null;
};

ConfirmDelete.propTypes = {
  table: PropTypes.string.isRequired,
  idForDelete: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
};

export default ConfirmDelete;
