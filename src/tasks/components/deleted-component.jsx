import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { handlerUpdateBD, fetchSupabaseDB } from "../../supabaseServices";
import useLoading from "../../context/loading";
import "../../App.css";

const ConfirmDelete = ({ table, idForDelete, url, onClose }) => {
  const { setIsLoading } = useLoading();
  const [nameDeleted, setNameDeleted] = useState("");
  const [key, setKey] = useState("");
  const [redirect, setRedirect] = useState(false);

  const columnUpdate = {
    is_active: false,
  };

  const fetchData = useCallback(async () => {
    if (table === "table_spacing") {
      setKey("name_spacing");
    } else if (table === "table_lists") {
      setKey("name_list");
    }

    const data = await fetchSupabaseDB(table, "*").then((res) => res.data);
    const filterData = data.find((item) => item.id === idForDelete);
    if (filterData) {
      setNameDeleted(filterData[key]);
    }
  }, [table, idForDelete, key]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (nameDeleted) {
      handleConfirm(nameDeleted);
    }
  }, [nameDeleted]);

  const onDesactivate = async () => {
    await handlerUpdateBD(table, columnUpdate, idForDelete);
    Swal.fire(
      "¡Eliminado!",
      `El espacio "${nameDeleted}" ha sido eliminado.`,
      "success"
    );
    setIsLoading(false);
    onClose(false);
    setRedirect(true);
  };

  const handleConfirm = (name) => {
    setIsLoading(true);
    Swal.fire({
      title: "¿Estás seguro?",
      html: `Se eliminará <strong>"${name}"</strong>.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        onDesactivate();
      } else {
        onClose(false);
        setIsLoading(false);
      }
    });
  };

  if (redirect) {
    return <Navigate to={url} replace />;
  }

  return null;
};

ConfirmDelete.propTypes = {
  table: PropTypes.string.isRequired,
  idForDelete: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

export default ConfirmDelete;
